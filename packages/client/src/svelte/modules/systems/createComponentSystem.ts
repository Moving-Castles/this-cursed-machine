import { get } from "svelte/store"
import {
  entities,
  playerNames,
  playerId as playerIdStore,
  playerPod as playerPodStore
} from "../state/base/stores"
import { publicNetwork } from "../network"
import { toCamelCase } from "../utils"
import { ComponentUpdate } from "@latticexyz/recs"
import { deepEqual } from "@wagmi/core"
import { player as playerStore } from "@modules/state/base/stores"

// The entityID is a player
// Ignore if not the local player
const PLAYER_PROPERTIES = [
  "spawnIndex",
  "currentOrder",
  "tutorial",
  "tutorialLevel",
  "nonTransferableBalance",
  "tokenBalances",
  "completedOrders",
  "producedMaterials"
]

// The entityID is a pod
// Ignore if not the local player's pod
const POD_PROPERTIES = [
  "fixedEntities",
  "tanksInPod",
  "machinesInPod",
  "buildTracker",
  "lastResolved"
]

// The entityID is a tank
// Ignore if not in the local player's pod
const TANK_PROPERTIES = [
  "amount",
  "materialId"
]

export function createComponentSystem(componentKey: string) {
  (get(publicNetwork).components as any)[componentKey].update$.subscribe(
    (update: ComponentUpdate) => {
      const [nextValue, prevValue] = update.value

      // If the values are the same we assume
      // this is directly after hydration
      // Abort
      if (deepEqual(nextValue, prevValue)) return

      const player = get(playerStore)
      const playerId = get(playerIdStore)
      const playerPod = get(playerPodStore)
      const entityID = update.entity as string
      const propertyName =
        componentKey === "ContainedMaterial"
          ? "materialId"
          : toCamelCase(componentKey)

      // console.log('propertyName', propertyName)
      // console.log('entityId', entityID)
      // console.log("playerId", playerId)
      // console.log("player pod", player.carriedBy)

      // * * * * * * * * * * *
      // Ongoing work on filtering down the updates to only those 
      // that are relevant to the current player.
      //
      // Goal is to have as few updates to the entities store as possible
      // * * * * * * * * * * *

      // We generally ignore other player but want to keep a record of their names
      if (propertyName === "name") {
        playerNames.update(value => {
          value[entityID] = newValue as any
          return value
        })
        // Abort
        return
      }

      // Abort if property is player-specific and entityId is not the player
      if (PLAYER_PROPERTIES.includes(propertyName) && entityID !== playerId) return

      // Abort if property is pod-specific and entityId is not the player's pod
      if (POD_PROPERTIES.includes(propertyName) && entityID !== player.carriedBy) return

      // Abort if property is tank-specific and tank is not in the player's pod
      if (TANK_PROPERTIES.includes(propertyName) && !playerPod.tanksInPod.includes(entityID)) return

      // Abort if the tankConnection is not for an inlet, outlet or tank in the player's pod
      if (propertyName === 'tankConnection' && ![
        playerPod.fixedEntities.outlet,
        ...playerPod.fixedEntities.inlets,
        ...playerPod.tanksInPod].includes(entityID)) return

      // * * * * * * * * * * *

      // Single-value components have a "value" property, structs do not
      const newValue =
        nextValue && Object.prototype.hasOwnProperty.call(nextValue, "value")
          ? nextValue.value
          : nextValue

      entities.update(value => {
        // Create an empty entity if it does not exist
        if (value[entityID] === undefined) value[entityID] = {} as Entity

        // Set or delete
        if (newValue === undefined) {
          delete value[entityID][propertyName]
        } else {
          value[entityID][propertyName] = newValue
        }

        return value
      })
    })
}
