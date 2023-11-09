/*
 *  Simulates the changing state of the game
 *
 */
import { EntityType, MachineType, MaterialType } from "../state/enums"
import { get, writable, derived } from "svelte/store"
import { capAtZero } from "../../modules/utils/misc"
import {
  entities,
  playerBox,
  playerEntityId,
  playerCore,
  machines,
} from "../state"
import { blockNumber } from "../network"
import type { SimulatedEntities, BoxOutputs } from "./types"
import { machineTypeToLabel } from "../state/convenience"

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
 * Set depending on whether the core is connected to the inlet.
 * Can be 1 or -1
 */
export const playerEnergyMod = writable(-1)

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
    if (!$playerCore) return {}
    return Object.fromEntries(
      Object.entries($simulated).filter(([_, entry]) => {
        // osn
        return (
          entry.entityType === EntityType.MACHINE &&
          entry.carriedBy === $playerCore.carriedBy
        )
      })
    )
  }
)

/** Connections */
export const simulatedConnections = derived(
  [simulatedMachines],
  ([$simulatedMachines]) => {
    console.log("START sim connections")
    let connections: Connection[] = []

    Object.entries($simulatedMachines).forEach(([address, machine]) => {
      console.log("Machine")
      console.log(address, machine)
    })

    console.log("END sim connections")
    console.log(connections)

    return connections
  }
)

/** Materials */
export const simulatedMaterials = derived(simulated, $simulated => {
  return Object.fromEntries(
    Object.entries($simulated).filter(
      ([_, entry]) => entry.entityType === EntityType.MATERIAL
    )
  )
})

/**
 * Derives a readable list of connections based on the input stores.
 *
 * Given the current connections, ports, machines, and playerCore, this function
 * will filter, map, and transform the connections to a more readable format
 * showcasing the relationship between source machines and target machines.
 * @param {Array} - Array of svelte stores: [connections, ports, machines, playerCore]
 * @returns {Array} - An array of transformed connection objects which includes the id,
 *                    connection details, and a human-readable label for each connection.
 */
export const readableConnections = derived(
  [simulatedConnections, machines, playerCore],
  ([$simulatedConnections, $machines, $playerCore]) => {
    return (
      Object.entries($simulatedConnections)
        .map(([id, connection]) => {
          // Get the material being transported
          const materialType = connection.product?.materialType

          // Extract the source and target ports for the current connection
          const sP = connection?.sourcePort
          const tP = connection?.targetPort

          if (sP && tP) {
            const ssP = false
            const ttP = false

            if (ssP && ttP) {
              // Fetch the machine types and indices for source and target
              const sourceMachine = machineTypeToLabel(
                $machines[ssP?.carriedBy]?.machineType
              )
              const sourceMachineIndex = $machines[ssP?.carriedBy]?.buildIndex
              const targetMachine = machineTypeToLabel(
                $machines[ttP?.carriedBy]?.machineType
              )
              const targetMachineIndex = $machines[ttP?.carriedBy]?.buildIndex

              if (sourceMachine && targetMachine) {
                // Construct a label showcasing the source to target machine connection

                return {
                  id,
                  connection,
                  label: `From ${sourceMachine}${
                    sourceMachineIndex ? ` #${sourceMachineIndex}` : ""
                  } To ${targetMachine}${
                    targetMachineIndex ? ` #${targetMachineIndex}` : ""
                  } ${
                    sourceMachine === "CORE"
                      ? `(${MaterialType[materialType]})`
                      : ""
                  }`,
                }
              }
            }
          }

          return false
        })
        // Filter out any invalid or non-transformed entries
        .filter(ent => ent)
    )
  }
)

export const readableMachines = derived(
  simulatedMachines,
  $simulatedMachines => {
    return Object.entries($simulatedMachines).map(([id, machine]) => ({
      id,
      machine,
      read: MachineType[machine.machineType],
    }))
  }
)

/**
 * Calculates the aggregated amount of each material type carried by the player,
 * considering patches on outlets.
 *
 * @function boxOutput
 * @exports
 * @param {Object} entities - A store containing all in-game entities.
 * @param {Object} playerCore - Store with information about the player's core properties.
 * @param {Number} blocksSinceLastResolution - Count of blockchain blocks since the last resolution.
 * @returns {Object} - An object where each key is a material type and the value is the aggregated amount
 *                     of that material type carried by the player, including patches.
 * @todo The way patches are added to outputs is hacky and needs a more robust solution.
 * @todo There's a need to handle a potential missing outlet.
 * @todo Consider handling scenarios where there are multiple outputs from patches.
 */
export const boxOutput = derived(
  [entities, playerCore, blocksSinceLastResolution],
  ([$entities, $playerCore, $blocksSinceLastResolution]) => {
    // Filter entities to retrieve only those which are of type MATERIAL and are in the same box as the player
    const singles = Object.entries($entities).filter(([_, entry]) => {
      return (
        entry.entityType === EntityType.MATERIAL &&
        entry.carriedBy === $playerCore.carriedBy
      )
    })

    // Initialize the result object.
    let result: BoxOutputs = {}

    // !!!
    // VERY hacky way to add patches to outputs
    // @todo: fix this

    // Get outlet entity
    const outlet = Object.entries($entities).find(([_, entry]) => {
      return (
        entry.entityType === EntityType.MACHINE &&
        entry.carriedBy === $playerCore.carriedBy &&
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
        material.amount + patchValue * $blocksSinceLastResolution
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

// --- MISC ----------------------------------------------

export const simulatedPlayerEnergy = derived(
  [simulatedPlayerCore, playerEnergyMod, blocksSinceLastResolution],
  ([$simulatedPlayerCore, $playerEnergyMod, $blocksSinceLastResolution]) => {
    return capAtZero(
      ($simulatedPlayerCore?.energy || 0) +
        $playerEnergyMod * $blocksSinceLastResolution
    )
  }
)
