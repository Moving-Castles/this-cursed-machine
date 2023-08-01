/*
 *  Central store for all entities in the game.
 * 
 */
import { writable, derived } from "svelte/store";
import { network, blockNumber } from "../network";
import { manhattanPath, isCoordinate } from "../../utils/space"; 
import { EntityType, ConnectionType } from "../../modules/state/types"
import type { Coord } from "@latticexyz/utils"

// --- CONSTANTS --------------------------------------------------------------

export const GAME_CONFIG_ID = "0x000000000000000000000000000000000000000000000000000000000000060d";
// ...
export const NULL_COORDINATE = { x: -1, y: -1 }

export const BUILDABLE_ENTITYTYPES = [
  EntityType.RESOURCE,
  EntityType.RESOURCE_TO_ENERGY
]

// --- STORES -----------------------------------------------------------------

// Mirror of the on chain state.
// Only ever written to via the update systems in /svelte/systems
export const entities = writable({} as Entities);

export const cores = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.type === EntityType.CORE && entity.bodyId === 0)) as Cores;
});

// these are the active organs
export const organs = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => {
    return entity.type === EntityType.RESOURCE ||
      entity.type === EntityType.RESOURCE_TO_ENERGY
  })) as Organs;
})

export const gameConfig = derived(entities, ($entities) => $entities[GAME_CONFIG_ID] as GameConfig);

// *** PLAYER -----------------------------------------------------------------

export const playerAddress = derived(network,
  $network => $network.network?.connectedAddress.get() || "0x0");

// Entity Id is a 32 byte hex string (64 characters long) of the player address
export const playerEntityId = derived(network,
  $network => $network.playerEntity || "0x0");

export const playerCore = derived([cores, playerEntityId],
  ([$cores, $playerEntityId]) => $cores[$playerEntityId] as Core
);

export const playerInCooldown = derived([playerCore, blockNumber],
  ([$playerCore, $blockNumber]) => $playerCore.readyBlock > $blockNumber
);

// *** GAME STATE -------------------------------------------------------------

/**
 * Connections
 */
export const connections = derived([entities], ([$entities]) => {
  let connections: Connection[] = [];
  for (const startEntity of Object.values($entities)) {
    if (startEntity.resourceConnection && startEntity.position && $entities[startEntity.resourceConnection]?.position) {
      connections.push({
        type: ConnectionType.RESOURCE,
        start: startEntity.position,
        end: $entities[startEntity.resourceConnection].position || { x: 0, y: 0 }
      });
    }
    if (startEntity.controlConnection && startEntity.position && $entities[startEntity.controlConnection]?.position) {
      connections.push({
        type: ConnectionType.CONTROL,
        start: startEntity.position,
        end: $entities[startEntity.controlConnection].position || { x: 0, y: 0 }
      });
    }
  }
  return connections;
});

export const foodSourceConnectedCores = derived([entities], ([$entities]) => {
  // If it has startBlock, it's connected to the food source
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.startBlock)) as Entity;
})

/**
 * Calculated energy
 */
export const calculatedEnergy = derived([cores, foodSourceConnectedCores, blockNumber, gameConfig],
  ([$cores, $foodSourceConnectedCores, $blockNumber, $gameConfig]) => {
    let calculatedEnergy: CalculatedEnergies = {};
    for (const [id, core] of Object.entries($cores)) {
      // Calculate lazy update energy, 0 if startBlock is not set
      // 1 energy per block, divided by number of cores connected to food source
      let lazyUpdateEnergy = core.startBlock ? Math.floor((Number($blockNumber) - Number(core.startBlock)) / Object.keys($foodSourceConnectedCores).length) : 0

      // Calculate core energy
      calculatedEnergy[id] = core.energy + lazyUpdateEnergy;
      // Cap core energy
      calculatedEnergy[id] = calculatedEnergy[id] > $gameConfig?.gameConfig.coreEnergyCap ? $gameConfig?.gameConfig.coreEnergyCap : calculatedEnergy[id];
    }
    return calculatedEnergy;
  });

export const playerCalculatedEnergy = derived([calculatedEnergy, playerEntityId], ([$calculatedEnergy, $playerEntityId]) => $calculatedEnergy[$playerEntityId])
export const dragOrigin = writable(NULL_COORDINATE as Coord)
export const dropDestination = writable(NULL_COORDINATE as Coord)

/**
 * Potential connections to draw
 */
export const potentialConnections = derived([dragOrigin, dropDestination, playerCore], ([$dragOrigin, $dropDestination, $playerCore]) => {
  const results = []
  // Return one connection for resource
  const resourcePotential = {
    type: ConnectionType.RESOURCE,
    start: $dragOrigin,
    end: $dropDestination
  }
  const controlPotential = {
    type: ConnectionType.CONTROL,
    start: $dragOrigin,
    end: $dropDestination
  }

  if (!$playerCore.resourceConnection) {
    results.push(resourcePotential)
  }

  if (!$playerCore.controlConnection) {
    results.push(controlPotential)
  }

  return results
})

/**
 * Planned connections to draw
 */
export const plannedConnection = derived([dragOrigin, dropDestination], ([$dragOrigin, $dropDestination]) => {
  // Return one connection for resource
  const planned = {
    type: ConnectionType.RESOURCE,
    start: $dragOrigin,
    end: $dropDestination
  }

  return planned
})

/**
 * Can the player afford control over this organ?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordControl = (coord: Coord) => derived([playerCore, playerCalculatedEnergy, gameConfig], ([$playerCore, $playerCalculatedEnergy, $gameConfig]) => {
  // Get the distance between the coordinate and the player
  const distance = manhattanPath($playerCore.position, coord).length
  const cost = $gameConfig.gameConfig.controlConnectionCost
  console.log('control cost: ', (distance - 2) * cost)
  return (distance - 2) * cost <= $playerCalculatedEnergy
})

/**
* Can the player afford resource for this organ?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordResource = (coord: Coord) => derived([playerCore, playerCalculatedEnergy, gameConfig], ([$playerCore, $playerCalculatedEnergy, $gameConfig]) => {
  // Get the distance between the coordinate and the player
  const distance = manhattanPath($playerCore.position, coord).length
  const cost = $gameConfig.gameConfig.resourceConnectionCost
  return (distance - 2) * cost <= $playerCalculatedEnergy
})

/**
 * Checks if the target is connect via resource directly or in a chain to the origin entity
 * @param origin the owner of the connection, for example the player's core address
 * @param target the target to check connection on
 * @returns derived store with boolean
 */
export const isConnectedResource = (origin: string, targets: string[]) => derived(entities, ($entities) => {
  let entity = $entities[origin]

  // follow the resource connection trace
  while (entity.resourceConnection) {
    if (targets.includes(entity.resourceConnection)) {
      return true
    }
    entity = $entities[entity.resourceConnection]
  }

  return false
})

/**
* Checks if the target is connect via control directly or in a chain to the origin entity
 * @param origin the owner of the connection, for example the player's core address
 * @param target the target to check connection on
 * @returns derived store with boolean
 */
export const isConnectedControl = (origin: string, targets: string[]) => derived(entities, ($entities) => {
  let entity = $entities[origin]

  // follow the resource connection trace
  while (entity.controlConnection) {
    if (targets.includes(entity.controlConnection)) return true
    entity = $entities[entity.controlConnection]
  }

  return false
})

/**
 * Check if there is a resource connection down the line to anyone
 * @param target The entity to check connection to
 * @returns derived store with boolean
 */
export const isConnectedResourceAny = (target: string) => derived(entities, ($entities) => {
  const connectedEntities = Object.entries($entities).filter(([add, ent]) => !!ent.resourceConnection)
  // add in this case is the address of the player
  // true if the player's resource
  return connectedEntities.some(([add, ent]) => { return ent.resourceConnection === target })
})
  

/**
 * Check if there is a control connection down the line to anyone
 * @param target The entity to check connection to
 * @returns derived store with boolean
 */
export const isConnectedControlAny = (target: string) => derived(entities, ($entities) => {
  const connectedEntities = Object.entries($entities).filter(([add, ent]) => !!ent.controlConnection)
  // add in this case is the address of the player
  // true if the player's resource
  return connectedEntities.some(([add, ent]) => { return ent.controlConnection === target })
})

/**
 * Get the entity at coordinate
 * @param coordinate Coord
 * @returns derived store with entityStoreEntry 
 */
export const tileEntity = (coordinate: Coord) => derived(entities, ($entities) => {
  const entity = Object.entries($entities).find(([_, ent]) => {
    if (ent.position) {
      return isCoordinate(ent.position, coordinate)
    }

    return false
  })

  if (entity) {
    return {
      address: entity[0],
      entity: entity[1]
    }
  }

  return false
})


export const isDraggable = (address: string) => derived([entities, playerCore], ([$entities, $playerCore]) => {
  return $playerCore.controlConnection === address
  // If the type is a modifier and the player's control connecction
  // If the type is resource split and the plauer's control connection
})

