/*
 *  Central store for all entities in the game.
 *
 */
import { EntityType, MachineType } from "./enums"
import { writable, derived } from "svelte/store"
import { network } from "../network"

export const GAME_CONFIG_ID = "0x"
export const EMPTY_CONNECTION = "0x0000000000000000000000000000000000000000000000000000000000000000"

// * * * * * * * * * * * * * * * * *
// DEFAULT ENTITY TYPES
// * * * * * * * * * * * * * * * * *

/**
 * Mirror of the full on chain state.
 *
 * Only ever written to via the update systems in module/ssystems
 */
export const entities = writable({} as Entities)


// * * * * * * * * * * * * * * * * *
// GAME CONFIG ENTITY TYPES
// * * * * * * * * * * * * * * * * *

/**
 * Game config
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

// * * * * * * * * * * * * * * * * *
// GAME PLAY ENTITY TYPES
// * * * * * * * * * * * * * * * * *

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
 * Machines
 */
export const machines = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.entityType === EntityType.MACHINE
    )
  ) as Machines
})

/**
 * Cores
 */
export const cores = derived(entities, $entities => {
  return Object.fromEntries(
    Object.entries($entities).filter(
      ([, entity]) => entity.machineType === MachineType.CORE
    )
  ) as Cores
})

// * * * * * * * * * * * * * * * * *
// CORE STORES
// * * * * * * * * * * * * * * * * *

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

export const playerGoals = derived(
  [playerCore, goals],
  ([$playerCore, $goals]) => {
    return Object.values($goals).filter(g => g.level === $playerCore.level)
  }
)
