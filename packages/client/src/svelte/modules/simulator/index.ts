/*
 *  Simulates the changing state of the game
 *
 */
import { MachineType } from "../state/enums"
import { writable, derived } from "svelte/store"
import { entities, playerBox, playerEntityId, playerCore } from "../state"
import { blockNumber } from "../network"
import { EntityType } from "../state/enums"
import type { SimulatedEntities } from "./types"
import { capAtZero } from "../utils/misc"

// --- CONSTANTS --------------------------------------------------------------
export const AVAILABLE_MACHINES = Object.values(MachineType).splice(
  0,
  Object.keys(MachineType).length / 2
)

// --- STORES -----------------------------------------------------------------

/**
 * Block on which the network was last resolved locally.
 * Used to check against the on-chain lastResolved value.
 */
export const localResolved = writable(0)

/**
 * Current block number - lastResolved
 */
export const blocksSinceLastResolution = derived(
  [blockNumber, playerBox],
  ([$blockNumber, $playerBox]) => {
    return $blockNumber - Number($playerBox.lastResolved)
  }
)

/**
 * Output of the the network resolver.
 */
export const patches = writable({} as SimulatedEntities)

/**
 * Potential machines
 */
export const potential = writable({} as SimulatedEntities)

/**
 * On-chain state with the local patches applied each block.
 */
export const simulated = derived(
  [entities, patches, potential, blocksSinceLastResolution],
  ([$entities, $patches, $potential, $blocksSinceLastResolution]) => {
    // Add a numerical ID to each entry for the terminal
    let i = 0

    let simulated: SimulatedEntities = Object.fromEntries([
      // Entities
      ...Object.entries($entities).map(([key, ent]) => {
        i++
        return [key, { ...ent, numericalID: i }]
      }),
      // Potential
      ...Object.entries($potential).map(([key, ent]) => {
        i++
        return [key, { ...ent, numericalID: i }]
      }),
    ])

    for (const [key, patch] of Object.entries($patches)) {
      // @todo: scaling the products by block since resolution is causing wrong values
      // for (let k = 0; k < simulated[key].intermediaryProducts.length; k++) {
      //     simulated[key].intermediaryProducts[k].amount = patch.intermediaryProducts[k].amount * $blocksSinceLastResolution
      // }
      if (patch.inputs && simulated[key]) {
        simulated[key].inputs = patch.inputs
      }
      if (patch.outputs && simulated[key]) {
        simulated[key].outputs = patch.outputs
      }
      // Energy
      // if (patch.energy && simulated[key]) {
      //   simulated[key].energy = capAtZero((simulated[key].energy || 0) + (patch.energy * $blocksSinceLastResolution))
      // }
    }

    return simulated
  }
)

/** Convenience methods for easy access */

/** Core */
export const simulatedPlayerCore = derived(
  [simulated, playerEntityId],
  ([$simulated, $playerEntityId]) => $simulated[$playerEntityId]
)

/** Boxes */
export const simulatedBoxes = derived(simulated, $simulated => {
  return Object.fromEntries(
    Object.entries($simulated).filter(
      ([_, entry]) => entry.entityType === EntityType.BOX
    )
  )
})

/** Machines */
export const simulatedMachines = derived(
  [simulated, playerCore],
  ([$simulated, $playerCore]) => {
    return Object.fromEntries(
      Object.entries($simulated).filter(([_, entry]) => {
        return (
          entry.entityType === EntityType.MACHINE &&
          entry.carriedBy === $playerCore.carriedBy
        )
      })
    )
  }
)

/** Connections */
export const simulatedConnections = derived(simulated, $simulated => {
  return Object.fromEntries(
    Object.entries($simulated).filter(
      ([_, entry]) => entry.entityType === EntityType.CONNECTION
    )
  )
})

/** Materials */
export const simulatedMaterials = derived(simulated, $simulated => {
  return Object.fromEntries(
    Object.entries($simulated).filter(
      ([_, entry]) => entry.entityType === EntityType.MATERIAL
    )
  )
})

/** Ports */
export const simulatedPorts = derived(simulated, $simulated => {
  return Object.fromEntries(
    Object.entries($simulated).filter(
      ([_, entry]) => entry.entityType === EntityType.PORT
    )
  )
})
