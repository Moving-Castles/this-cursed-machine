/*
 *  Central store for all entities in the game.
 *
 */
import { EntityType, MachineType, PortType } from "./enums"
import { writable, derived } from "svelte/store"
import { network, blockNumber } from "../network"
import { NULL_COORDINATE } from "../utils/space"

// --- CONSTANTS --------------------------------------------------------------

export const GAME_CONFIG_ID = "0x"

// --- STORES -----------------------------------------------------------------

/**
 * Mirror of the full on chain state.
 *
 * Only ever written to via the update systems in module/ssystems
 */
export const entities = writable({} as Entities)

/**
 * Global config entity
 */
export const gameConfig = derived(
  entities,
  $entities => $entities[GAME_CONFIG_ID].gameconfig as GameConfig
)

/**
 * Levels
 */
export const levels = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.LEVEL
    )
  ) as Levels
})

/**
 * Recipes
 */
export const recipes = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.RECIPE
    )
  ) as Recipes
})

/**
 * Goals
 */
export const goals = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.GOAL
    )
  ) as Goals
})

/**
 * Boxes
 */
export const boxes = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.BOX
    )
  ) as Boxes
})

/**
 * Materials
 */
export const materials = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.MATERIAL
    )
  ) as Materials
})

/**
 * Machines are in the box and convert their inputs to outputs.
 */
export const machines = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.MACHINE
    )
  )
})

/**
 * Cores are the agents of the player.
 */
export const cores = derived(machines, $machines => {
  return Object.fromEntries(
    Object.entries($machines).filter(
      ([, machine]) => machine.machineType === MachineType.CORE
    )
  ) as Cores
})

/**
 * Connections bind cores and organs together.
 */
export const connections = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.CONNECTION
    )
  ) as Connections
})

/**
 * Ports are the entry and exit points
 */
export const ports = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.PORT
    )
  ) as Ports
})

// Port inputs
export const inputs = derived(ports, $ports => {
  return Object.fromEntries(
    Object.entries($ports).filter(
      ([, port]) => port.portType === PortType.INPUT
    )
  ) as Ports
})

// Port outputs
export const outputs = derived(ports, $ports => {
  return Object.fromEntries(
    Object.entries($ports).filter(
      ([, port]) => port.portType === PortType.OUTPUT
    )
  ) as Ports
})

// *** PLAYER -----------------------------------------------------------------

export const playerAddress = derived(
  network,
  $network => $network.walletClient?.account.address || "0x0"
)

/**
 * Entity Id is a 32 byte hex string (64 characters long) of the player address
 */
export const playerEntityId = derived(
  network,
  $network => $network.playerEntity || "0x0"
)

export const playerCore = derived(
  [cores, playerEntityId],
  ([$cores, $playerEntityId]) => $cores[$playerEntityId]
)

export const playerInCooldown = derived(
  [playerCore, blockNumber],
  ([$playerCore, $blockNumber]) => $playerCore.readyBlock > $blockNumber
)

export const playerBox = derived(
  [entities, playerCore],
  ([$entities, $playerCore]) => {
    if ($playerCore && $playerCore.carriedBy) {
      return $entities[$playerCore.carriedBy] as Box
    } else {
      return {} as Box
    }
  }
)

export const entitiesInBox = derived(
  [entities, playerCore],
  ([$entities, $playerCore]) => {
    return Object.fromEntries(
      Object.entries($entities).filter(
        ([, entity]) => entity.carriedBy === $playerCore.carriedBy
      )
    ) as Entities
  }
)

export const playerCorePorts = derived(
  [entities, playerEntityId],
  ([$entities, $playerEntityId]) => {
    return Object.fromEntries(
      Object.entries($entities).filter(
        ([, entity]) =>
          entity.type === EntityType.PORT &&
          entity.carriedBy === $playerEntityId
      )
    ) as Ports
  }
)

export const coresInPlayerBox = derived(
  [cores, playerCore],
  ([$cores, $playerCore]) => {
    return Object.values($cores).filter(core => {
      return core.carriedBy == $playerCore.carriedBy
    }) as Core[]
  }
)

export const machinesInPlayerBox = derived(
  [machines, playerCore],
  ([$machines, $playerCore]) => {
    return Object.fromEntries(
      Object.entries($machines).filter(
        ([, entity]) => entity.carriedBy === $playerCore.carriedBy
      )
    ) as Machines
  }
)

export const playerCalculatedEnergy = derived(
  [blockNumber, playerCore],
  ([$blockNumber, $playerCore]) => {
    if ($playerCore) {
      return $playerCore.energy
      // return Number($playerCore.readyBlock) - Number($blockNumber)
    } else {
      return 0
    }
  }
)

// Will be deprecated
export const dragOrigin = writable(NULL_COORDINATE as Coord)
export const dropDestination = writable(NULL_COORDINATE as Coord)
export const hoverDestination = writable(NULL_COORDINATE as Coord)

// Initially set on spawn
export const originAddress = writable("")
export const destinationAddress = writable("")

/**
 * Can the player afford resource for this organ?
 * @param coord Coordinate of the tile one tries to connect to
 * @returns derived store with boolean
 */
export const playerCanAffordMachine = (cost: number) =>
  derived([playerCalculatedEnergy], ([$playerCalculatedEnergy]) => {
    // Get the distance between the coordinate and the player
    return cost <= $playerCalculatedEnergy
  })

/**
 * Get the inputs on given entity's address
 * @param address string
 * @returns Port[]
 */
export const inputsForEntity = (address: string) =>
  derived([entities], ([$entities]) => {
    return Object.fromEntries(
      Object.entries($entities).filter(
        ([_, entity]) =>
          entity.entityType === EntityType.PORT &&
          entity.carriedBy === address &&
          entity?.portType === PortType.INPUT
      )
    ) as Ports
  })

/**
 * Get the outputs on given entity's address
 * @param address string
 * @returns Port[]
 */
export const outputsForEntity = (address: string) =>
  derived([entities], ([$entities]) => {
    return Object.fromEntries(
      Object.entries($entities).filter(
        ([_, entity]) =>
          entity.entityType === EntityType.PORT &&
          entity.carriedBy === address &&
          entity?.portType === PortType.OUTPUT
      )
    ) as Ports
  })

export const playerGoals = derived(
  [playerBox, goals],
  ([$playerBox, $goals]) => {
    return Object.values($goals).filter(g => g?.level === $playerBox.level)
  }
)
