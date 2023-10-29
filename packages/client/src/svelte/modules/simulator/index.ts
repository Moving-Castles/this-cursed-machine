/*
 *  Simulates the changing state of the game
 *
 */
import { EntityType, MachineType, PortType, MaterialType } from "../state/enums"
import { get, writable, derived } from "svelte/store"
import { capAtZero } from "../../modules/utils/misc"
import {
  portBelongsToBox,
  connectionBelongsToBox,
  machinePorts,
} from "../state/convenience"
import {
  entities,
  playerBox,
  playerEntityId,
  playerCore,
  ports,
  connections,
  machines,
  playerGoals,
} from "../state"
import { blockNumber } from "../network"
import type { SimulatedEntities, BoxOutputs } from "./types"

// --- CONSTANTS --------------------------------------------------------------
export const AVAILABLE_MACHINES = Object.values(MachineType).splice(
  4, // exclude some
  Object.keys(MachineType).length / 2 - 4
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
 * On-chain state with the local patches applied each block.
 */
export const simulated = derived(
  [entities, patches],
  ([$entities, $patches]) => {
    let simulated: SimulatedEntities = Object.fromEntries([
      // Entities
      ...Object.entries($entities),
    ])

    // Attach products to the ports and connections
    for (const [key, patch] of Object.entries($patches)) {
      // Inputs
      if (patch.inputs && simulated[key]) {
        simulated[key] = { ...simulated[key], inputs: [...patch.inputs] }

        patch.inputs.forEach((input, i) => {
          simulated[key] = { ...simulated[key], product: input.inputs }

          if (simulated[key].entityType === EntityType.MACHINE) {
            const ports = Object.entries(simulated).filter(([_, ent]) => {
              return (
                ent?.carriedBy === key &&
                ent.entityType === EntityType.PORT &&
                ent.portType === PortType.OUTPUT
              )
            })
            if (ports.length > 0 && input.inputs) {
              const portAddress = ports[i][0]
              simulated[portAddress] = {
                ...simulated[portAddress],
                product: input.inputs,
              }

              console.log("simulated[portAddress]")
              console.log(simulated[portAddress])
            }
          }
        })
      }

      // Outputs
      if (patch.outputs && simulated[key]) {
        simulated[key] = { ...simulated[key], outputs: [...patch.outputs] }

        patch.outputs.forEach(output => {
          simulated[key] = { ...simulated[key], product: output.outputs }

          if (simulated[key].entityType === EntityType.MACHINE) {
            //
          }
        })
      }
    }

    console.log("updated simulated", simulated)

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
  [simulated, playerCore],
  ([$simulated, $playerCore]) => {
    if (!$playerCore) return {}
    return Object.fromEntries(
      Object.entries($simulated)
        .filter(([_, entry]) => entry.entityType === EntityType.CONNECTION)
        .filter(([_, entry]) =>
          connectionBelongsToBox(entry, $playerCore.carriedBy)
        )
    )
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

/** Ports */
export const simulatedPorts = derived(
  [simulated, playerCore],
  ([$simulated, $playerCore]) => {
    if (!$playerCore) return {}
    return Object.fromEntries(
      Object.entries($simulated)
        .filter(([_, entry]) => entry.entityType === EntityType.PORT)
        .filter(([_, entry]) => portBelongsToBox(entry, $playerCore.carriedBy))
    )
  }
)

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
  [simulatedConnections, ports, machines, playerCore],
  ([$simulatedConnections, $ports, $machines, $playerCore]) => {
    return (
      Object.entries($simulatedConnections)
        // Filter connections to only those that belong to the current box carried by player
        .filter(([_, entry]) =>
          connectionBelongsToBox(entry, $playerCore.carriedBy)
        )
        .map(([id, connection]) => {
          // Get the material being transported
          const materialType = connection.product?.materialType
          console.log(connection.product)

          // Extract the source and target ports for the current connection
          const sP = connection?.sourcePort
          const tP = connection?.targetPort

          if (sP && tP) {
            const ssP = $ports[sP]
            const ttP = $ports[tP]

            if (ssP && ttP) {
              // Fetch the machine types and indices for source and target
              const sourceMachine =
                MachineType[$machines[ssP?.carriedBy]?.machineType]
              const sourceMachineIndex = $machines[ssP?.carriedBy]?.buildIndex
              const targetMachine =
                MachineType[$machines[ttP?.carriedBy]?.machineType]
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

export const playerEnergyMod = writable(-1)

export const simulatedPlayerEnergy = derived(
  [simulatedPlayerCore, playerEnergyMod, blocksSinceLastResolution],
  ([$simulatedPlayerCore, $playerEnergyMod, $blocksSinceLastResolution]) => {
    return capAtZero(
      ($simulatedPlayerCore?.energy || 0) +
        $playerEnergyMod * $blocksSinceLastResolution
    )
  }
)

// Return the number of the last solved level
export const goalsSatisfied = derived(
  [playerGoals, boxOutput, simulatedPlayerEnergy],
  ([$playerGoals, $boxOutput, $simulatedPlayerEnergy]) => {
    const achieved = $playerGoals.map(goal => {
      if (goal?.materialType === 0) {
        return $simulatedPlayerEnergy >= goal?.amount
      }

      const pooledMaterial = $boxOutput[goal.materialType]

      return pooledMaterial && pooledMaterial >= goal?.amount
    })

    return achieved.every(v => v === true)
  }
)
