/*
 *  Central store for all entities in the game.
 *
 */
import { ENTITY_TYPE, MACHINE_TYPE } from "./enums"
import { filterByEntitytype, filterByMachinetype } from "./utils"
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
// GAME CONFIG ENTITIES
// * * * * * * * * * * * * * * * * *

export const gameConfig = derived(entities, $entities => $entities[GAME_CONFIG_ID].gameconfig as GameConfig)
export const recipes = derived(entities, $entities => filterByEntitytype($entities, ENTITY_TYPE.RECIPE) as Recipes)

// * * * * * * * * * * * * * * * * *
// GAME PLAY ENTITIES
// * * * * * * * * * * * * * * * * *

export const pods = derived(entities, $entities => filterByEntitytype($entities, ENTITY_TYPE.POD) as Pods)
export const machines = derived(entities, $entities => filterByEntitytype($entities, ENTITY_TYPE.MACHINE) as Machines)
export const depots = derived(entities, $entities => filterByEntitytype($entities, ENTITY_TYPE.DEPOT) as Depots)
export const players = derived(entities, $entities => filterByMachinetype($entities, MACHINE_TYPE.PLAYER) as Players)
export const orders = derived(entities, $entities => filterByEntitytype($entities, ENTITY_TYPE.ORDER) as Orders)

// * * * * * * * * * * * * * * * * *
// PLAYER STORES
// * * * * * * * * * * * * * * * * *

export const playerAddress = derived(network, $network => $network.walletClient?.account.address || "0x0" as string)
export const playerEntityId = derived(network, $network => $network.playerEntity || "0x0" as string)
export const playerEntity = derived([entities, playerEntityId], ([$entities, $playerEntityId]) => $entities[$playerEntityId] as Player)

export const playerPod = derived(
  [entities, playerEntity],
  ([$entities, $playerEntity]) => {
    if ($playerEntity && $playerEntity.carriedBy) {
      return $entities[$playerEntity.carriedBy] as Pod
    } else {
      return {} as Pod
    }
  }
)

export const machinesInPlayerPod = derived(
  [machines, playerEntity],
  ([$machines, $playerEntity]) => {
    return Object.fromEntries(
      Object.entries($machines).filter(
        ([, entity]) => entity.carriedBy === $playerEntity.carriedBy
      )
    ) as Machines
  }
)