/*
 *  Central store for all entities in the game.
 *
 */
import { EntityType, MachineType } from "./enums"
import { filterByEntitytype, filterByMachinetype } from "./utils"
import { writable, derived } from "svelte/store"
import { network } from "../network"

export const GAME_CONFIG_ID = "0x"
export const EMPTY_CONNECTION = "0x0000000000000000000000000000000000000000000000000000000000000000"
export const WAREHOUSE_ID = "0xf001000000000000000000000000000000000000000000000000000000000000"

export const LEVEL_PAR_TIMES = {
  1: 100,
  2: 100,
  3: 100,
  4: 100,
  5: 100,
  6: 100,
  7: 100
}

export const PROGRESSION_PAR_TIME = Object.values(LEVEL_PAR_TIMES).reduce((total, current) => total + current, 0);

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
// GAME CONFIG ENTITIES
// * * * * * * * * * * * * * * * * *

export const gameConfig = derived(entities, $entities => $entities[GAME_CONFIG_ID].gameconfig as GameConfig)
export const levels = derived(entities, $entities => filterByEntitytype($entities, EntityType.LEVEL) as Levels)
export const recipes = derived(entities, $entities => filterByEntitytype($entities, EntityType.RECIPE) as Recipes)
export const goals = derived(entities, $entities => filterByEntitytype($entities, EntityType.GOAL) as Goals)

// * * * * * * * * * * * * * * * * *
// GAME PLAY ENTITIES
// * * * * * * * * * * * * * * * * *

export const warehouse = derived(entities, $entities => filterByEntitytype($entities, EntityType.WAREHOUSE)[0] as Warehouse)
export const boxes = derived(entities, $entities => filterByEntitytype($entities, EntityType.BOX) as Boxes)
export const materials = derived(entities, $entities => filterByEntitytype($entities, EntityType.MATERIAL) as Materials)
export const machines = derived(entities, $entities => filterByEntitytype($entities, EntityType.MACHINE) as Machines)
export const cores = derived(entities, $entities => filterByMachinetype($entities, MachineType.CORE) as Cores)

// * * * * * * * * * * * * * * * * *
// PLAYER STORES
// * * * * * * * * * * * * * * * * *

export const playerAddress = derived(network, $network => $network.walletClient?.account.address || "0x0" as string)
export const playerEntityId = derived(network, $network => $network.playerEntity || "0x0" as string)
export const playerCore = derived([entities, playerEntityId], ([$entities, $playerEntityId]) => $entities[$playerEntityId] as Core)

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
