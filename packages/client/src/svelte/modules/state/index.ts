/*
 *  Central store for all entities in the game.
 * 
 */
import { EntityType, PortType } from "./enums"
import { writable, derived } from "svelte/store";
import { network, blockNumber } from "../network";
import { aStarPath, withinBounds, sameCoordinate } from "../utils/space";
import type { Coord } from "@latticexyz/utils"

// --- CONSTANTS --------------------------------------------------------------

export const GAME_CONFIG_ID = "0x";
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
 * Cores are the agents of the player.
 */
export const cores = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => entity.entityType === EntityType.CORE)) as Cores;
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

/**
 * These are the active organs
 */
export const organs = derived(entities, ($entities) => {
  return Object.fromEntries(Object.entries($entities).filter(([, entity]) => {
    return entity.type !== EntityType.RESOURCE &&
      entity.type !== EntityType.RESOURCE_TO_ENERGY
  })) as Organs;
})


// *** PLAYER -----------------------------------------------------------------

export const playerAddress = derived(network,
  $network => $network.walletClient?.account.address || "0x0");

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

export const inputsForEntity = (address: string) => derived([entities], ([$entities]) => {
  return Object.fromEntries(Object.entries($entities).filter(([_, entity]) =>
    entity.entityType === EntityType.PORT &&
    entity.carriedBy === address &&
    entity?.portType === PortType.INPUT
  )) as Ports;
})

export const outputsForEntity = (address: string) => derived([entities], ([$entities]) => {
  return Object.fromEntries(Object.entries($entities).filter(([_, entity]) =>
    entity.entityType === EntityType.PORT &&
    entity.carriedBy === address &&
    entity?.portType === PortType.OUTPUT
  )) as Ports;
})

export const isDraggable = (address: string) => derived([entities], ([$entities]) => true)

export const portSelection = writable([])

/**
 * Port corrected coordinates
 * @param coord 
 * @param port 
 * @param entity 
 * @returns 
 */
const portCorrectedCoordinate = (coord: Coord, port: Port, entity: Entity) => {
  const rotationMapping = {
    0: { x: 0, y: -1 },
    1: { x: 1, y: 0 },
    2: { x: 0, y: 1 },
    3: { x: -1, y: 0 }
  }

  // Port direction is port side corrected by rotation
  const portDirection = port.portPlacement
  const entityRotation = entity.rotation || 0

  

  const totalRotation = (portDirection + entityRotation) % 4

  


  // Get the next coordinate in the correct direction
  return {
    x: coord.x + rotationMapping[totalRotation].x,
    y: coord.y + rotationMapping[totalRotation].y
  }
}

/**
 * Exceptions for the pathfinding
 */
export const pathfindingExceptions = writable([] as Coord[])


/**
 * Paths that are path-found
 */
export const paths = derived([connections, entities], ([$connections, $entities]) => Object.values($connections).map((conn) => {
  const sourcePort = $entities[conn?.sourcePort] as Port
  const targetPort = $entities[conn?.targetPort] as Port
  let ignore = Object.values($entities).filter(ent => ent.position).map(({ position }) => position) as Coord[]

  if (sourcePort && targetPort && sourcePort.carriedBy && targetPort.carriedBy) {
    const startEntity = $entities[sourcePort.carriedBy]
    const endEntity = $entities[targetPort.carriedBy]
    if (startEntity?.position && endEntity?.position) {
      // ignore = [...ignore].filter((coord) => !sameCoordinate(coord, startEntity.position) && !sameCoordinate(coord, endEntity.position))

      // Consider start and end paths
      return [
        startEntity.position,
        ...aStarPath(
          portCorrectedCoordinate(startEntity.position, sourcePort, startEntity),
          portCorrectedCoordinate(endEntity.position, targetPort, endEntity.position),
          ignore
        ),
        endEntity.position
    ]
    }
  }

  return NULL_COORDINATE
}))

/**
 * Planned path
 */
export const makePlannedPath = (width: number, height: number) => derived([portSelection, entities, hoverDestination, pathfindingExceptions], ([$portSelection, $entities, $hoverDestination, $pathfindingExceptions]) => {
  const ignore = Object.values($entities)
    .filter(ent => ent.position)
    .map(({ position }) => position)
    .filter(a => !$pathfindingExceptions.some(b => sameCoordinate(b, a))) // remove the exceptionsas Coord[]
  console.log(ignore)

  // We only wanna plan a path when the port selection is 1.
  if ($portSelection.length === 1) {
    const port = $entities[$portSelection[0]]
    const entity = $entities[port?.carriedBy]  

    const startCoord = portCorrectedCoordinate(entity.position, port as Port, entity)

    if (withinBounds(startCoord, width, height)) {
      
      return [
        entity.position,
        ...aStarPath(startCoord, $hoverDestination, ignore)
      ]
    }
  }

  return NULL_COORDINATE
})