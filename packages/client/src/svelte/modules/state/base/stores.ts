/*
 *  Central store for all entities in the game.
 *
 */
import { ENTITY_TYPE, MACHINE_TYPE } from "./enums"
import {
  filterByEntitytype,
  filterByMachinetype,
  filterByCarriedBy,
  getRecipes,
  getAvailableOrders,
  getExpiredOrders,
} from "./utils"
import { writable, derived } from "svelte/store"
import { blockNumber, network } from "@modules/network"
import { GAME_CONFIG_ID } from "@modules/state/base/constants"

// * * * * * * * * * * * * * * * * *
// DEFAULT ENTITY TYPES
// * * * * * * * * * * * * * * * * *

/**
 * Mirror of the full on chain state.
 * Only ever written to via the update systems in module/ssystems
 */
export const entities = writable({} as Entities)

// * * * * * * * * * * * * * * * * *
// GAME CONFIG ENTITIES
// * * * * * * * * * * * * * * * * *

export const gameConfig = derived(
  entities,
  $entities => ($entities[GAME_CONFIG_ID]?.gameConfig || {}) as GameConfig
)

export const recipes = derived(entities, $entities => getRecipes($entities))

// * * * * * * * * * * * * * * * * *
// PLAYER STORES
// * * * * * * * * * * * * * * * * *

// Address in padded format
export const playerAddress = derived(
  network,
  $network => $network.walletClient?.account.address || ("0x0" as string)
)

// Non-padded address
export const playerId = derived(
  network,
  $network => $network.playerEntity || ("0x0" as string)
)

export const player = derived(
  [entities, playerId],
  ([$entities, $playerId]) => $entities[$playerId] as Player
)

export const playerPod = derived([entities, player], ([$entities, $player]) =>
  $player?.carriedBy ? ($entities[$player.carriedBy] as Pod) : ({} as Pod)
)

// If the player is in tutorial we use the non transferable balance
export const playerTokenBalance = derived([player], ([$player]) => {
  if ($player.tutorial) {
    return $player.nonTransferableBalance ?? 0
  } else {
    return $player.tokenBalances ?? 0
  }
})

// * * * * * * * * * * * * * * * * *
// GAME PLAY ENTITIES
// * * * * * * * * * * * * * * * * *

// Filter by player pod
export const machines = derived(
  [entities, player],
  ([$entities, $player]) =>
    filterByEntitytype(
      filterByCarriedBy($entities, $player?.carriedBy ?? ""),
      ENTITY_TYPE.MACHINE
    ) as Machines
)

// Filter by player pod
export const depots = derived(
  [entities, player],
  ([$entities, $player]) =>
    filterByEntitytype(
      filterByCarriedBy($entities, $player?.carriedBy ?? ""),
      ENTITY_TYPE.DEPOT
    ) as Depots
)

export const players = derived(
  entities,
  $entities => filterByMachinetype($entities, MACHINE_TYPE.PLAYER) as Players
)

export const orders = derived(
  entities,
  $entities => filterByEntitytype($entities, ENTITY_TYPE.ORDER) as Orders
)
export const availableOrders = derived(
  [orders, blockNumber, player],
  ([$orders, $blockNumber, $player]) =>
    getAvailableOrders(
      $orders,
      $blockNumber,
      $player.tutorial,
      $player.tutorialLevel ?? 0
    )
)
export const expiredOrders = derived(
  [orders, blockNumber],
  ([$orders, $blockNumber]) => getExpiredOrders($orders, $blockNumber)
)

export const offers = derived(
  entities,
  $entities => filterByEntitytype($entities, ENTITY_TYPE.OFFER) as Offers
)

// * * * * * * * * * * * * * * * * *
// POD FIXTURES
// * * * * * * * * * * * * * * * * *

export const outlet = derived(
  [machines, playerPod],
  ([$machines, $playerPod]) => {
    let outlet = {} as Machines
    const outletId = $playerPod?.fixedEntities?.outlet
    outlet[outletId] = $machines[outletId]
    return outlet
  }
)

export const inlets = derived(
  [machines, playerPod],
  ([$machines, $playerPod]) => {
    let inlets: Machines = {}
    $playerPod?.fixedEntities?.inlets.forEach(inlet => {
      inlets[inlet] = $machines[inlet]
    })
    return inlets
  }
)
