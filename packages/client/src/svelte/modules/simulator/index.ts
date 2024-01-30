/*
 *  Simulates the changing state of the game
 *
 */
import { EMPTY_CONNECTION } from "../state"
import { EntityType, MachineType, MaterialType } from "../state/enums"
import { get, writable, derived } from "svelte/store"
import type { Writable } from "svelte/store"
import { capAtZero } from "../../modules/utils/misc"
import { entities, playerPod, playerEntityId, playerEntity } from "../state"
import { blockNumber } from "../network"
import type { SimulatedEntities, PodOutputs, Connection } from "./types"

// --- CONSTANTS --------------------------------------------------------------
export const AVAILABLE_MACHINES = Object.values(MachineType).splice(
  4, // exclude some
  Object.keys(MachineType).length / 2 - 4
)

// --- STORES -----------------------------------------------------------------

/**
 * Output of the the network resolver.
 */
export const patches = writable({} as SimulatedEntities)

/**
 * Block on which the network was last resolved locally.
 * Used to check against the on-chain lastResolved value.
 */
export const localResolved = writable(0)

/**
 * Current block number - lastResolved
 */
export const blocksSinceLastResolution = derived(
  [blockNumber, playerPod],
  ([$blockNumber, $playerPod]) => {
    return $blockNumber - Number($playerPod.lastResolved)
  }
)

/**
 * Generates a derived on-chain state by applying local patches to entities each block.
 *
 * @param {Store} entities - The svelte store representing the entities' state.
 * @param {Store} patches - The svelte store representing patches to be applied.
 *
 * @returns {DerivedStore} simulated - The derived state after applying the patches.
 */
export const simulated = derived(
  [entities, patches],
  ([$entities, $patches]) => {
    // Initialize the simulated state using the entities from the entities store.
    let simulated: SimulatedEntities = Object.fromEntries([
      ...Object.entries($entities),
    ])

    // Iterate over each patch in the patches store.
    for (const [key, patch] of Object.entries($patches)) {
      // Process inputs from the patch if they exist and the entity for the key exists in the simulated state.
      if (patch.inputs && simulated[key]) {
        // Assign the inputs from the patch to the entity's inputs in the simulated state.
        simulated[key] = { ...simulated[key], inputs: [...patch.inputs] }

        // Iterate over each input in the patch.
        patch.inputs.forEach((input, i) => {
          // Assign the product from the input to the entity's product in the simulated state.
          simulated[key] = { ...simulated[key], product: input.inputs }
        })
      }

      // Process outputs from the patch if they exist and the entity for the key exists in the simulated state.
      if (patch.outputs && simulated[key]) {
        // Assign the outputs from the patch to the entity's outputs in the simulated state.
        simulated[key] = { ...simulated[key], outputs: [...patch.outputs] }

        // Iterate over each output in the patch.
        patch.outputs.forEach(output => {
          // Assign the product from the output to the entity's product in the simulated state.
          simulated[key] = { ...simulated[key], product: output.outputs }
        })
      }
    }

    // Log the updated simulated state.
    // console.log("updated simulated", simulated)

    // Return the updated simulated state.
    return simulated
  }
)

/** Convenience methods for easy access */

/** Player */
export const simulatedPlayerEntity = derived(
  [simulated, playerEntityId],
  ([$simulated, $playerEntityId]) => $simulated[$playerEntityId]
)

/** Pods */
export const simulatedPods = derived(simulated, $simulated => {
  return Object.fromEntries(
    Object.entries($simulated).filter(
      ([_, entry]) => entry.entityType === EntityType.POD
    )
  )
})

/** Machines */
export const simulatedMachines = derived(
  [simulated, playerEntity],
  ([$simulated, $playerEntity]) => {
    if (!$playerEntity) return {}
    return Object.fromEntries(
      Object.entries($simulated).filter(([_, entry]) => {
        // osn
        return (
          entry.entityType === EntityType.MACHINE &&
          entry.carriedBy === $playerEntity.carriedBy
        )
      })
    )
  }
)

/** Connections @returns Connection[] */
export const simulatedConnections = derived(
  [simulatedMachines],
  ([$simulatedMachines]) => {
    let connections: Connection[] = []

    Object.entries($simulatedMachines).forEach(([sourceAddress, machine]) => {
      machine.outgoingConnections?.forEach((targetAddress, i) => {
        if (targetAddress === EMPTY_CONNECTION) return
        const sourceMachine = $simulatedMachines[sourceAddress]
        const product = sourceMachine?.outputs
          ? sourceMachine?.outputs[i]
          : null
        connections.push({
          id: `${sourceAddress}-${targetAddress}-${i}`,
          sourceMachine: sourceAddress,
          targetMachine: targetAddress,
          portIndex: i,
          product: product,
        })
      })
    })

    return connections
  }
)

export const readableMachines = derived(
  simulatedMachines,
  $simulatedMachines => {
    return Object.entries($simulatedMachines).map(([id, machine]) => ({
      id,
      machine,
      read: MachineType[machine.machineType ?? MachineType.NONE],
    }))
  }
)

/**
 * Calculates the aggregated amount of each material type carried by the player,
 * considering patches on outlets.
 *
 * @function podOutput
 * @exports
 * @param {Object} entities - A store containing all in-game entities.
 * @param {Object} playerEntity - Store with information about the player's properties.
 * @param {Number} blocksSinceLastResolution - Count of blockchain blocks since the last resolution.
 * @returns {Object} - An object where each key is a material type and the value is the aggregated amount
 *                     of that material type carried by the player, including patches.
 * @todo The way patches are added to outputs is hacky and needs a more robust solution.
 * @todo There's a need to handle a potential missing outlet.
 * @todo Consider handling scenarios where there are multiple outputs from patches.
 */
export const podOutput = derived(
  [entities, playerEntity, blocksSinceLastResolution],
  ([$entities, $playerEntity, $blocksSinceLastResolution]) => {
    // Filter entities to retrieve only those which are of type MATERIAL and are in the same pod as the player
    const singles = Object.entries($entities).filter(([_, entry]) => {
      return (
        entry.entityType === EntityType.MATERIAL &&
        entry.carriedBy === $playerEntity.carriedBy
      )
    })

    // Initialize the result object.
    let result: PodOutputs = {} as PodOutputs

    // !!!
    // VERY hacky way to add patches to outputs
    // @todo: fix this

    // Get outlet entity
    const outlet = Object.entries($entities).find(([_, entry]) => {
      return (
        entry.entityType === EntityType.MACHINE &&
        entry.carriedBy === $playerEntity.carriedBy &&
        entry.machineType === MachineType.OUTLET
      )
    })

    // Get patches on outlet
    // @todo: handle missing outlet
    const patchesOnOutlet = outlet ? get(patches)[outlet[0]] : false

    // Loop through the filtered materials to aggregate their amounts by material type.
    // Materials are consolidated onchain, so there will only ever be one entry per material type.
    singles.forEach(([_, material]) => {
      // Get patch value
      // @todo: possibly handle multiple outputs
      let patchValue =
        patchesOnOutlet &&
          patchesOnOutlet.outputs &&
          patchesOnOutlet.outputs[0] &&
          patchesOnOutlet.outputs[0].materialType === material.materialType
          ? patchesOnOutlet.outputs[0].amount
          : 0
      result[material.materialType || MaterialType.NONE] =
        material?.amount ?? 0 + patchValue * $blocksSinceLastResolution
    })

    // Handle patches that are not yet resolved
    if (
      patchesOnOutlet &&
      patchesOnOutlet.outputs &&
      patchesOnOutlet.outputs[0] &&
      patchesOnOutlet.outputs[0].materialType &&
      !result[patchesOnOutlet.outputs[0].materialType]
    ) {
      result[patchesOnOutlet.outputs[0].materialType] =
        patchesOnOutlet.outputs[0].amount * $blocksSinceLastResolution
    }

    return result
  }
)
