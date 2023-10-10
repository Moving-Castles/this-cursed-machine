/*
 *  Simulates the changing state of the game
 *
 */
import { EntityType, MachineType, PortType } from "../state/enums"
import { get, writable, derived } from "svelte/store"
import { capAtZero } from "../../modules/utils/misc"
import { portBelongsToBox, connectionBelongsToBox } from "../state/convenience"
import {
  entities,
  playerBox,
  playerEntityId,
  playerCore,
  ports,
  connections,
  machines,
} from "../state"
import { blockNumber } from "../network"
import type { SimulatedEntities } from "./types"

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
    }

    return simulated
  }
)

export const coreIsConnectedToInlet = derived(
  [ports, machines, connections, playerEntityId],
  ([$ports, $machines, $connections, $playerEntityId]) => {
    const _coreEntity = $playerEntityId

    // *** 1. Get all input ports on the core
    const inputPortsOnCores = Object.fromEntries(
      Object.entries($ports).filter(
        ([_, port]) =>
          port.carriedBy === _coreEntity && port.portType === PortType.INPUT
      )
    )
    // Abort early if no input ports on core
    if (Object.keys(inputPortsOnCores).length === 0) return false

    // *** 2. Get connections going to input on core
    const connectionsToInputPortsOnCores = Object.fromEntries(
      Object.entries($connections).filter(
        ([_, connection]) =>
          connection.targetPort === Object.keys(inputPortsOnCores)[0]
      )
    )

    // HACK: short circuit for now
    // if (Object.keys(connectionsToInputPortsOnCores).length !== 0) return true;
    // return false;

    // Abort early if no connections to input ports on core
    if (Object.keys(connectionsToInputPortsOnCores).length === 0) return false

    // 3. Get output ports at end of connections
    const outputPortsAtEndOfConnections =
      $ports[Object.values(connectionsToInputPortsOnCores)[0].sourcePort]

    // 4. Check if machine at end of connection is an inlet
    if (
      $machines[outputPortsAtEndOfConnections.carriedBy].machineType !==
      MachineType.INLET
    )
      return false

    // Core is connected
    return true
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
    return Object.fromEntries(
      Object.entries($simulated)
        .filter(([_, entry]) => entry.entityType === EntityType.PORT)
        .filter(([_, entry]) => portBelongsToBox(entry, $playerCore.carriedBy))
    )
  }
)

// --- READABLE ------------------------------------------
export const readableConnections = derived(
  [connections, ports, machines],
  ([$connections, $ports, $machines]) => {
    return Object.entries($connections)
      .map(([id, connection]) => {
        const sP = connection?.sourcePort
        const tP = connection?.targetPort

        if (sP && tP) {
          const ssP = $ports[sP]
          const ttP = $ports[tP]

          if (ssP && ttP) {
            const sourceMachine =
              MachineType[$machines[ssP?.carriedBy]?.machineType]
            const targetMachine =
              MachineType[$machines[ttP?.carriedBy]?.machineType]
            if (sourceMachine && targetMachine) {
              return {
                id,
                connection,
                read: `From ${sourceMachine} To ${targetMachine}`,
              }
            }
          }
        }

        return false
      })
      .filter(ent => ent)
  }
)

export const readableMachines = derived(
  simulatedMachines,
  $simulatedMachines => {
    return Object.entries($simulatedMachines).map(([id, machine]) => ({
      id,
      machine,
      read: `${MachineType[machine.machineType]} (${machine.numericalID})`,
    }))
  }
)

export const boxOutput = derived(
  [entities, playerCore],
  ([$entities, $playerCore]) => {
    // Outputs
    const singles = Object.entries($entities).filter(([_, entry]) => {
      return (
        entry.entityType === EntityType.MATERIAL &&
        entry.carriedBy === $playerCore.carriedBy
      )
    })

    let result = {}

    singles.forEach(([_, material]) => {
      if (result[material.materialType]) {
        const amount = result[material.materialType]

        result[material.materialType] = amount + material.amount
      } else {
        result[material.materialType] = material.amount
      }
    })

    return result
  }
)

// --- MISC ----------------------------------------------

export const simulatedPlayerEnergy = derived(
  [simulatedPlayerCore, coreIsConnectedToInlet, blocksSinceLastResolution],
  ([
    $simulatedPlayerCore,
    $coreIsConnectedToInlet,
    $blocksSinceLastResolution,
  ]) => {
    return capAtZero(
      ($simulatedPlayerCore?.energy || 0) +
        ($coreIsConnectedToInlet ? 1 : -1) * $blocksSinceLastResolution
    )
  }
)
