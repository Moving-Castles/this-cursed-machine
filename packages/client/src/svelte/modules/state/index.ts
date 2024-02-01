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
export const recipes = derived(entities, $entities => filterByEntitytype($entities, EntityType.RECIPE) as Recipes)

// * * * * * * * * * * * * * * * * *
// GAME PLAY ENTITIES
// * * * * * * * * * * * * * * * * *

export const pods = derived(entities, $entities => filterByEntitytype($entities, EntityType.POD) as Pods)
export const machines = derived(entities, $entities => filterByEntitytype($entities, EntityType.MACHINE) as Machines)
export const storages = derived(entities, $entities => filterByEntitytype($entities, EntityType.STORAGE) as Storages)
export const players = derived(entities, $entities => filterByMachinetype($entities, MachineType.PLAYER) as Players)
export const orders = derived(entities, $entities => filterByEntitytype($entities, EntityType.ORDER) as Orders)

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

export const dispenser = derived(
  [entities, playerPod],
  ([$entities, $playerPod]) => {
    return $entities[$playerPod.fixedEntities.dispenser] as Dispenser
  })