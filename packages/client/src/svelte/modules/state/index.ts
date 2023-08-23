/*
 *  Central store for all entities in the game.
 * 
 */
import { EntityType, MachineType, PortType } from "./enums"
import { readable, writable, derived } from "svelte/store";
import { network, blockNumber } from "../network";
import { NULL_COORDINATE, aStarPath, sameCoordinate } from "../utils/space";
import type { Coord } from "@latticexyz/utils"

// --- CONSTANTS --------------------------------------------------------------

export const GAME_CONFIG_ID = "0x";

// --- STORES -----------------------------------------------------------------

/**
 * Mirror of the full on chain state.
 * 
 * Only ever written to via the update systems in module/ssystems
 */
export const entities = writable({} as Entities);

/**
 * Global config entity
 */
export const gameConfig = derived(entities, ($entities) => $entities[GAME_CONFIG_ID].gameconfig as GameConfig);

/**
 * Boxes
 */
export const boxes = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.entityType === EntityType.BOX)) as Boxes;
});


/**
 * Machines are in the box and convert their inputs to outputs.
*/
export const machines = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.entityType === EntityType.MACHINE))
});

/**
 * Cores are the agents of the player.
 */
export const cores = derived(machines, ($machines) => {
  return Object.fromEntries(Object.entries($machines).filter(([, machine]) => machine.machineType === MachineType.CORE)) as Cores;
});

/**
 * Connections bind cores and organs together.
 */
export const connections = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.entityType === EntityType.CONNECTION)) as Connections;
});

/**
 * Ports are the entry and exit points
 */
export const ports = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.entityType === EntityType.PORT)) as Ports;
});

// Port inputs
export const inputs = derived(ports, ($ports) => {
  return Object.fromEntries(Object.entries($ports).filter(([, port]) => port.portType === PortType.INPUT)) as Ports;
});
// Port outputs
export const outputs = derived(ports, ($ports) => {
  return Object.fromEntries(Object.entries($ports).filter(([, port]) => port.portType === PortType.OUTPUT)) as Ports;
});



// *** PLAYER -----------------------------------------------------------------

export const playerAddress = derived(network,
  $network => $network.walletClient?.account.address || "0x0");

/**
 * Entity Id is a 32 byte hex string (64 characters long) of the player address
 */
export const playerEntityId = derived(network,
  $network => $network.playerEntity || "0x0");

export const playerCore = derived([cores, playerEntityId],
  ([$cores, $playerEntityId]) => $cores[$playerEntityId]
);

export const playerInCooldown = derived([playerCore, blockNumber],
  ([$playerCore, $blockNumber]) => $playerCore.readyBlock > $blockNumber
);

export const playerBox = derived([entities, playerCore],
  ([$entities, $playerCore]) => $entities[$playerCore.carriedBy] as Box
);

export const playerCorePorts = derived([entities, playerEntityId],
  ([$entities, $playerEntityId]) => {
    return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.type === EntityType.PORT && entity.carriedBy === $playerEntityId)) as Ports;
  }
);

export const coresInPlayerBox = derived([cores, playerCore], ([$cores, $playerCore]) => {
  return Object.values($cores).filter((core) => {
    return core.carriedBy == $playerCore.carriedBy
  }) as Core[];
})

/**
 * !!! WORK IN PROGRESS !!! Calculated energy
 * 
 * Currently adds the lazy update energy to the core energy by going through the claims related to the core.
 * 
 * Will be more general later(TM)...
 */
// export const calculatedEnergy = derived([cores, claims, blockNumber, gameConfig],
//   ([$cores, $claims, $blockNumber, $gameConfig]) => {
//     let calculatedEnergy: CalculatedEnergies = {};

//     // Iterate over all cores
//     for (const [id, core] of Object.entries($cores)) {

//       // Get all claims for this core
//       let claimsForCore = Object.values($claims).filter(claim => claim.sourceEntity === id)

//       let lazyUpdateEnergy = 0

//       // Iterate over claims and calculate lazy update energy
//       for (const claim of claimsForCore) {
//         lazyUpdateEnergy += Math.floor((Number($blockNumber) - Number(claim.claimBlock)))
//       }

//       // Calculate core energy
//       calculatedEnergy[id] = core.energy + lazyUpdateEnergy;

//       // Cap core energy
//       calculatedEnergy[id] = calculatedEnergy[id] > $gameConfig?.coreEnergyCap ? $gameConfig?.coreEnergyCap : calculatedEnergy[id];
//     }
//     return calculatedEnergy;
//   });

export const playerCalculatedEnergy = derived([], () => 0)

// Will be deprecated
export const dragOrigin = writable(NULL_COORDINATE as Coord)
export const dropDestination = writable(NULL_COORDINATE as Coord)
export const hoverDestination = writable(NULL_COORDINATE as Coord)

// Initially set on spawn
export const originAddress = writable("")
export const destinationAddress = writable("")

let u = []
  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 6; y++) {
      if (x === 0 || x === 5 || y === 0 || y === 5) {
        u.push({ x, y })
      }
    }
  }
export const untraversables  = readable(u)


/**
 * Can the player afford control over this control?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordControl = (coord: Coord) => derived([playerCore, playerCalculatedEnergy, gameConfig], ([$playerCore, $playerCalculatedEnergy, $gameConfig]) => {
  let cost = 0
  // Get the distance between the coordinate and the player
  const distance = aStarPath($playerCore.position, coord).length
  if ($gameConfig) {
    cost = $gameConfig.controlConnectionCost
  }

  return (distance - 2) * cost <= $playerCalculatedEnergy
})

/**
* Can the player afford resource for this resource?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordResource = (coord: Coord) => derived([playerCore, playerCalculatedEnergy, gameConfig], ([$playerCore, $playerCalculatedEnergy, $gameConfig]) => {
  let cost = 0

  // Get the distance between the coordinate and the player
  const distance = aStarPath($playerCore.position, coord).length

  if ($gameConfig) {
    cost = $gameConfig.resourceConnectionCost
  }
  return (distance - 2) * cost <= $playerCalculatedEnergy
})

/**
* Can the player afford resource for this organ?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordMachine = (cost: number) => derived([playerCalculatedEnergy], ([$playerCalculatedEnergy]) => {
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
      return sameCoordinate(ent.position, coordinate)
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

/**
 * Get the inputs on given entity's address
 * @param address string
 * @returns Port[]
 */
export const inputsForEntity = (address: string) => derived([entities], ([$entities]) => {
  return Object.fromEntries(Object.entries($entities).filter(([_, entity]) =>
    entity.entityType === EntityType.PORT &&
    entity.carriedBy === address &&
    entity?.portType === PortType.INPUT
  )) as Ports;
})

/**
 * Get the outputs on given entity's address
 * @param address string
 * @returns Port[]
 */
export const outputsForEntity = (address: string) => derived([entities], ([$entities]) => {
  return Object.fromEntries(Object.entries($entities).filter(([_, entity]) =>
    entity.entityType === EntityType.PORT &&
    entity.carriedBy === address &&
    entity?.portType === PortType.OUTPUT
  )) as Ports;
})