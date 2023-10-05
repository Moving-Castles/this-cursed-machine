/*
 *  Simulates the changing state of the game
 *
 */
import { MachineType, PortType } from "../state/enums"
import { get, writable, derived } from "svelte/store"
import {
  entities, playerBox, playerEntityId, playerCore, ports, connections, machines
} from "../state"
import { blockNumber } from "../network"
import { EntityType } from "../state/enums"
import type { SimulatedEntities } from "./types"

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

export const coreIsConnectedToInlet = derived(
  [playerEntityId],
  ([$playerEntityId]) => {
    const _coreEntity = $playerEntityId;

    console.log('evaluating coreIsConnectedToInlet ...', _coreEntity)

    // *** 1. Get all input ports on the core
    const inputPortsOnCores = Object.fromEntries(
      Object.entries(get(ports)).filter(
        ([_, port]) => port.carriedBy === _coreEntity && port.portType === PortType.INPUT
      )
    )
    // DEBUG
    console.log('inputPortsOnCores', inputPortsOnCores);
    console.log('Object.keys(inputPortsOnCores)', Object.keys(inputPortsOnCores))
    console.log("get(connections)", get(connections))

    // Abort early if no input ports on core
    if (Object.keys(inputPortsOnCores).length === 0) return false;

    // *** 2. Get connections going to input on core
    const connectionsToInputPortsOnCores = Object.fromEntries(
      Object.entries(get(connections)).filter(
        ([_, connection]) => connection.targetPort === Object.keys(inputPortsOnCores)[0]
      )
    )

    // DEBUG
    console.log('connectionsToInputPortsOnCores', connectionsToInputPortsOnCores);

    // HACK: short circuit for now
    // if (Object.keys(connectionsToInputPortsOnCores).length !== 0) return true;
    // return false;

    // Abort early if no connections to input ports on core
    if (Object.keys(connectionsToInputPortsOnCores).length === 0) return false;

    // 3. Get output ports at end of connections
    const outputPortsAtEndOfConnections = get(ports)[Object.values(connectionsToInputPortsOnCores)[0].sourcePort]

    // DEBUG
    console.log('outputPortsAtEndOfConnections', outputPortsAtEndOfConnections);

    // 4. Check if machine at end of connection is an inlet
    if (get(machines)[outputPortsAtEndOfConnections.carriedBy].machineType !== MachineType.INLET) return false;

    // Core is connected
    return true;
  })


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
