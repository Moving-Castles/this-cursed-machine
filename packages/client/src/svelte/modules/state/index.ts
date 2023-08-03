/*
 *  Central store for all entities in the game.
 * 
 */
import { writable, derived } from "svelte/store";
import { network, blockNumber } from "../network";
import { aStarPath, isCoordinate, getDirection } from "../../utils/space"; 
import { EntityType } from "../../modules/state/types"
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

/**
 * Mirror of the full on chain state.
 * 
 * Only ever written to via the update systems in module/ssystems
 */
export const entities = writable({} as Entities);

/**
 * Cores are the agents of the player.
 */
export const cores = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.type === EntityType.CORE && entity.bodyId === 0)) as Cores;
});

/**
 * Connections bind cores and organs together.
 * 
 * Can be of type resource or control.
 */
export const connections = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.type === EntityType.RESOURCE_CONNECTION || entity.type === EntityType.CONTROL_CONNECTION)) as Connections;
});

/**
 * Claims represent a lazily updated change to some value on an entity.
 * 
 * These are settled, ie. added to the actual entity values, whenever some action is taken.
 * 
 * NOTE: Currently only energy is supported. Generally very WIP right now.
 */
export const claims = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.type === EntityType.CLAIM)) as Claims;
});

/**
 * These are the active organs
 */
export const organs = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => {
    return entity.type !== EntityType.RESOURCE &&
      entity.type !== EntityType.RESOURCE_TO_ENERGY
  })) as Organs;
})

export const gameConfig = derived(entities, ($entities) => $entities[GAME_CONFIG_ID] as GameConfig);

export const buildableOrgans: BuildableEntity[] = [
  {
    type: EntityType.RESOURCE,
    name: "food",
    cost: 10
  },
  {
    type: EntityType.RESOURCE_TO_ENERGY,
    name: "mouth",
    cost: 120
  },
  ]


// *** PLAYER -----------------------------------------------------------------

export const playerAddress = derived(network,
  $network => $network.network?.connectedAddress.get() || "0x0");

/**
 * Entity Id is a 32 byte hex string (64 characters long) of the player address
 */
export const playerEntityId = derived(network,
  $network => $network.playerEntity || "0x0");

export const playerCore = derived([cores, playerEntityId],
  ([$cores, $playerEntityId]) => $cores[$playerEntityId] as Core
);

export const playerInCooldown = derived([playerCore, blockNumber],
  ([$playerCore, $blockNumber]) => $playerCore.readyBlock > $blockNumber
);

/**
 * !!! WORK IN PROGRESS !!! Calculated energy
 * 
 * Currently adds the lazy update energy to the core energy by going through the claims related to the core.
 * 
 * Will be more general later(TM)...
 */
export const calculatedEnergy = derived([cores, claims, blockNumber, gameConfig],
  ([$cores, $claims, $blockNumber, $gameConfig]) => {
    let calculatedEnergy: CalculatedEnergies = {};

    // Iterate over all cores
    for (const [id, core] of Object.entries($cores)) {

      // Get all claims for this core
      let claimsForCore = Object.values($claims).filter(claim => claim.sourceEntity === id)

      let lazyUpdateEnergy = 0

      // Iterate over claims and calculate lazy update energy
      for (const claim of claimsForCore) {
        lazyUpdateEnergy += Math.floor((Number($blockNumber) - Number(claim.claimBlock)))
      }

      // Calculate core energy
      calculatedEnergy[id] = core.energy + lazyUpdateEnergy;

      // Cap core energy
      calculatedEnergy[id] = calculatedEnergy[id] > $gameConfig?.gameConfig.coreEnergyCap ? $gameConfig?.gameConfig.coreEnergyCap : calculatedEnergy[id];
    }
    return calculatedEnergy;
  });

export const playerCalculatedEnergy = derived([calculatedEnergy, playerEntityId], ([$calculatedEnergy, $playerEntityId]) => $calculatedEnergy[$playerEntityId])

// Will be deprecated
export const dragOrigin = writable(NULL_COORDINATE as Coord)
export const dropDestination = writable(NULL_COORDINATE as Coord)

// Initially set on spawn
export const originAddress = writable("")
export const destinationAddress = writable("")

/**
 * Potential connections to draw TODO: Replace
 */
export const potentialConnections = derived([dragOrigin, dropDestination, playerCore], ([$dragOrigin, $dropDestination, $playerCore]) => {
  // Return one connection for resource
  const resourcePotential = {
    type: EntityType.RESOURCE_CONNECTION,
    start: $dragOrigin,
    end: $dropDestination
  }
  const controlPotential = {
    type: EntityType.CONTROL_CONNECTION,
    start: $dragOrigin,
    end: $dropDestination
  }

  // Check if the core's control is not already connected

  return [resourcePotential, controlPotential]
})


/**
 * Planned connections to draw TODO: replace
 */
export const plannedConnection = derived([dragOrigin, dropDestination], ([$dragOrigin, $dropDestination]) => {
  return {
    start: $dragOrigin,
    end: $dropDestination
  }
})

/**
 * Can the player afford control over this control?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordControl = (coord: Coord) => derived([playerCore, playerCalculatedEnergy, gameConfig], ([$playerCore, $playerCalculatedEnergy, $gameConfig]) => {
  // Get the distance between the coordinate and the player
  const distance = aStarPath($playerCore.position, coord).length
  const cost = $gameConfig.gameConfig.controlConnectionCost
  
  return (distance - 2) * cost <= $playerCalculatedEnergy
})

/**
* Can the player afford resource for this resource?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordResource = (coord: Coord) => derived([playerCore, playerCalculatedEnergy, gameConfig], ([$playerCore, $playerCalculatedEnergy, $gameConfig]) => {
  // Get the distance between the coordinate and the player
  const distance = aStarPath($playerCore.position, coord).length
  const cost = $gameConfig.gameConfig.resourceConnectionCost
  return (distance - 2) * cost <= $playerCalculatedEnergy
})

/**
* Can the player afford resource for this organ?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordOrgan = (cost: number) => derived([playerCalculatedEnergy], ([$playerCalculatedEnergy]) => {
  // Get the distance between the coordinate and the player
  
  return cost <= $playerCalculatedEnergy
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


export const isDraggable = (address: string) => derived([entities], ([$entities]) => true )

/**
 * An object with the connection's address mapped to a path with start port and end port
 * Port is -1 if not end or start
 */
export const connectionsWithPortInformation = derived([connections, entities, organs], ([$connections, $entities, $organs]) => {
  function firstAvailablePortNumber (ports: (string | number)[], address: string) {
    // go up the array until you find a number
    // return the modified array
    let port = -1

    for (let i = 0; i < ports.length; i++) {
      console.log(typeof ports)
      if (typeof ports[i] === "number") {
        port = ports[i]
        ports[i] = address
        break
      }
    }

    return {
      portNumber: port,
      updatedPorts: ports
    }
  }
  const north = [0, 1, 2, 3]
  const east = [4, 5, 6, 7]
  const south = [8, 9, 10, 11]
  const west = [12, 13, 14, 15]
  const ports = { north, east, south, west }

  let temp = Object.entries($organs).map(([_, organ]) => ([_, { ...organ, ports: { ...ports } }]))
  const organsWithPorts = Object.fromEntries(temp)

  const result = Object.entries($connections).map(([address, connection]) => {
    const startCoord = $entities[connection.sourceEntity].position
    const endCoord = $entities[connection.targetEntity].position

    let path = aStarPath(startCoord, endCoord)

    // get the organ
    const organ = organsWithPorts[address]
    
    // Edge case: right next???
    for (let i = 0; i < path.length; i++) {
      let port = -1
      let direction = ""
      
      if (i === path.length - 1) {
        direction = getDirection(path[i], path[i - 1])
        // compare end and second to last for entry direction
      } else {
        direction = getDirection(path[i], path[i + 1])
        // compare 0 and 1 for leave direction
      }

      if (i === 0 || i === path.length - 1) {
        let ports = [...organ.ports[direction]]

        const { portNumber, updatedPorts } = firstAvailablePortNumber(ports, address)
        
        port = portNumber

        // Update ports with 
        organ.ports[direction] = updatedPorts
      }

      path[i] = {
        ...path[i],
        direction,
        port
      }
    }

    return [address, path]
  })

  return Object.fromEntries(result)
})