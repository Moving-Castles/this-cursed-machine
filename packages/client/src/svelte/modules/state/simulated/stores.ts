import { derived } from "svelte/store"
import { deepClone } from "@modules/utils/"
import { EMPTY_CONNECTION } from "@modules/utils/constants"
import { MATERIAL_TYPE } from "@modules/state/base/enums"
import { blockNumber } from "@modules/network"
import type {
  SimulatedEntities,
  SimulatedDepots,
  SimulatedDepot,
  SimulatedMachines,
  Connection,
  SimulatedMachine,
  Attachment,
} from "./types"
import {
  machines,
  depots,
  playerPod,
  player,
  orders,
  availableOrders,
} from "@modules/state/base/stores"
import { patches } from "@modules/state/resolver/patches/stores"
import { blocksSinceLastResolution } from "@modules/state/resolver/stores"
import { GRAPH_ENTITY_STATE } from "./enums"
import { FLOW_RATE, DEPOT_CAPACITY } from "@modules/state/simulated/constants"

export function processInputPatches(
  simulated: SimulatedEntities,
  key: string,
  patch: any
): SimulatedMachines {
  // Create a deep copy of 'simulated' to avoid mutating the original object.
  const simulatedCopy = deepClone(simulated) as SimulatedMachines

  // Assign the inputs/outputs from the patch to a new copy of the entity in the simulated state.
  const updatedEntity: SimulatedMachine = {
    ...simulatedCopy[key],
    inputs: [...patch.inputs],
  }

  // Update the entity in the simulated copy with the new changes.
  simulatedCopy[key] = updatedEntity

  // Return the updated copy of 'simulated'.
  return simulatedCopy
}

export function processOutputPatches(
  simulated: SimulatedEntities,
  key: string,
  patch: any
): SimulatedMachines {
  // Create a deep copy of 'simulated' to avoid mutating the original object.
  const simulatedCopy = deepClone(simulated) as SimulatedMachines

  if (!patch.outputs) return simulatedCopy

  // Assign the inputs/outputs from the patch to a new copy of the entity in the simulated state.
  let updatedEntity: SimulatedMachine = {
    ...simulatedCopy[key],
    outputs: [...patch.outputs],
    productive: patch.productive ?? false,
  }

  updatedEntity.products = []

  for (const output of patch.outputs) {
    if (output.materialType === MATERIAL_TYPE.NONE) continue
    updatedEntity.products.push({
      materialType: output.materialType,
      amount: output.amount,
    })
  }

  if (updatedEntity.products.length > 0) {
    updatedEntity.state = GRAPH_ENTITY_STATE.ACTIVE
  }

  // Update the entity in the simulated copy with the new changes.
  simulatedCopy[key] = updatedEntity

  // Return the updated copy of 'simulated'.
  return simulatedCopy
}

export function applyPatches(
  machines: Machines,
  patches: SimulatedEntities
): SimulatedMachines {
  // Exit early if there are no patches.
  if (Object.keys(patches).length === 0) return machines as SimulatedMachines

  let simulatedMachines: SimulatedMachines = Object.fromEntries([
    ...Object.entries(machines).map(([key, machine]) => [
      key,
      { ...machine, products: [], state: GRAPH_ENTITY_STATE.IDLE },
    ]),
  ])

  const filteredPatches = Object.entries(patches).filter(
    ([_, patch]) => !patch.depot
  )

  // Iterate over each patch in the patches store.
  for (const [key, patch] of filteredPatches) {
    simulatedMachines = processInputPatches(simulatedMachines, key, patch)
    simulatedMachines = processOutputPatches(simulatedMachines, key, patch)
  }

  // Return the updated simulated state.
  return simulatedMachines
}

export function calculateSimulatedDepots(
  depots: Depots,
  patches: SimulatedEntities,
  blocksSinceLastResolution: number,
  playerPod: Pod
): SimulatedDepots {
  /*
   * This function updates the inlet and outlet depots
   *
   * Should work the same as contracts/src/libraries/LibDepot.sol:write
   *
   * Generally the output is what is produced by the outlet machine * blocks past
   *
   * But, we need to take into account the following limiting factors:
   * - The amount of material in the inlet depots
   * - The capacity of the outlet depot
   *
   * We need to find the lowest of the two limiting factors and cap the number of blocks by that
   */

  // Create deep copy to avoid accidentally mutating the original object.
  const initialDepotsCopy = deepClone(depots)

  let simulatedDepots: SimulatedDepots = Object.fromEntries([
    ...Object.entries(initialDepotsCopy),
  ])

  if (!playerPod?.fixedEntities) return simulatedDepots

  const outletDepot = Object.entries(initialDepotsCopy).filter(
    ([_, depot]) => depot.depotConnection === playerPod?.fixedEntities.outlet
  )
  const inletDepots = Object.entries(initialDepotsCopy).filter(([_, depot]) =>
    playerPod?.fixedEntities.inlets.includes(depot.depotConnection)
  )
  const depotPatches = Object.entries(patches).filter(
    ([_, patch]) => patch.depot
  )

  if (
    outletDepot.length === 0 ||
    inletDepots.length === 0 ||
    depotPatches.length === 0
  )
    return simulatedDepots

  const outletDepotPatch = depotPatches.find(
    ([key, _]) => key == outletDepot[0][0]
  )

  if (!outletDepotPatch) return simulatedDepots

  /*
   * Filter out the inlet depots that are not contributing to the output
   */
  const usedInletDepots = getUsedInletDepots(
    inletDepots,
    playerPod.fixedEntities.inlets,
    depotPatches
  )
  const usedInletDepotsKeys = usedInletDepots.map(([key, _]) => key)

  const lowestInputAmount = findLowestValue(usedInletDepots)
  if (lowestInputAmount === 0) return simulatedDepots

  /*
   * With a flow rate of FLOW_RATE per block,
   * how long does it take for the lowest input to be exhausted?
   */
  const inletExhaustionBlock = lowestInputAmount / FLOW_RATE

  /*
   * When is the outlet depot full?
   * available capacity of the depot / flow rate of the outlet product
   */
  const outletFullBlock =
    (DEPOT_CAPACITY - outletDepot[0][1].amount) /
    outletDepotPatch[1].inputs[0].amount

  /*
   * Stop block is the lowest of the two limiting factors
   */
  const stopBlock =
    inletExhaustionBlock > outletFullBlock
      ? outletFullBlock
      : inletExhaustionBlock

  const cappedBlocks =
    stopBlock > blocksSinceLastResolution
      ? blocksSinceLastResolution
      : stopBlock

  for (const [key, patch] of depotPatches) {
    if (!simulatedDepots[key]) continue

    /*
     * Write to outlet depot
     * Add if material is same, otherwise replace
     */
    if (Array.isArray(patch.inputs) && patch.inputs[0]) {
      const patchInput = patch.inputs[0]
      const cumulativeOutputAmount = patchInput.amount * cappedBlocks
      if (initialDepotsCopy[key].materialType === patchInput.materialType) {
        simulatedDepots[key].amount =
          (initialDepotsCopy[key].amount ?? 0) + cumulativeOutputAmount
      } else {
        simulatedDepots[key].materialType = patchInput.materialType
        simulatedDepots[key].amount = cumulativeOutputAmount
      }
    }

    /*
     * Write to inlet depots
     * Check that the inlet depot contributed to the output
     * Empty depot if we exhausted it
     */
    if (
      Array.isArray(patch.outputs) &&
      patch.outputs[0] &&
      usedInletDepotsKeys.includes(key)
    ) {
      const consumedInletAmount = cappedBlocks * FLOW_RATE
      if (consumedInletAmount === initialDepotsCopy[key].amount) {
        simulatedDepots[key].materialType = MATERIAL_TYPE.NONE
        simulatedDepots[key].amount = 0
      } else {
        simulatedDepots[key].amount =
          initialDepotsCopy[key].amount - consumedInletAmount
      }
    }
  }

  // Return the updated simulated state.
  return simulatedDepots
}

function findLowestValue(usedInletDepots: [string, Depot][]): number {
  let lowestEntry: [string, Depot] | null = null

  for (const [key, depot] of usedInletDepots) {
    if (!lowestEntry || depot.amount < lowestEntry[1].amount) {
      lowestEntry = [key, depot]
    }
  }

  if (!lowestEntry) return 0

  return lowestEntry[1].amount ?? 0
}

/*
 * Checks the output patch of the outlet to see which inlets contributed to the output.
 * Then finds the depots connected to those inlets
 */
function getUsedInletDepots(
  inletDepots: [string, Depot][],
  inlets: string[],
  depotPatches: [string, SimulatedDepot][]
): [string, Depot][] {
  let inletActive: boolean[] | null = null
  let usedInletDepots: [string, Depot][] = []

  // Find the outlet patch – it is the only one with inputs
  for (const [, patch] of depotPatches) {
    if (Array.isArray(patch.inputs) && patch.inputs[0]) {
      // Get the boolean array indicating which of the inlets contributed to the final output
      inletActive = patch.inputs[0].inletActive
      break
    }
  }

  if (inletActive == null) return usedInletDepots

  // Iterate over the inlet depots and check if the inlet it is connected is active
  for (let i = 0; i < inletDepots.length; i++) {
    const inletIndex = inlets.indexOf(inletDepots[i][1].depotConnection)

    if (inletActive[inletIndex]) {
      usedInletDepots.push(inletDepots[i])
    }
  }

  return usedInletDepots
}

export function calculateSimulatedConnections(
  simulatedMachines: SimulatedMachines
): Connection[] {
  let connections: Connection[] = []

  Object.entries(simulatedMachines).forEach(([sourceAddress, machine]) => {
    if (!machine?.outgoingConnections) return
    machine?.outgoingConnections.forEach((targetAddress, i) => {
      if (targetAddress === EMPTY_CONNECTION) return

      const sourceMachine = simulatedMachines[sourceAddress]
      const targetMachine = simulatedMachines[targetAddress]

      if (!sourceMachine || !targetMachine) return connections

      if (!targetMachine?.incomingConnections) return connections

      const targetPortIndex = targetMachine?.incomingConnections?.findIndex(
        connection => connection === sourceAddress
      )

      if (!sourceMachine) return

      let connection: Connection = {
        id: `FROM-${sourceAddress}-TO-${targetAddress}-${i}`,
        sourceMachine: sourceAddress,
        targetMachine: targetAddress,
        portIndex: {
          source: i,
          target: targetPortIndex,
        },
        products: [],
        state: GRAPH_ENTITY_STATE.IDLE,
        productive: sourceMachine.productive ?? false,
      }

      // If the source machine has an output:
      // Assign material and amount, and set state to active
      if (
        sourceMachine.outputs &&
        sourceMachine.outputs[i] &&
        sourceMachine.outputs[i].materialType !== MATERIAL_TYPE.NONE
      ) {
        connection.products = [
          {
            materialType: sourceMachine.outputs[i].materialType,
            amount: sourceMachine.outputs[i].amount,
          },
        ]
        connection.state = GRAPH_ENTITY_STATE.ACTIVE
      }

      connections.push(connection)
    })
  })

  return connections
}

// Simulated state = on-chain state of the machines + patches produced by the local resolver
export const simulatedMachines = derived(
  [machines, patches],
  ([$machines, $patches]) => applyPatches($machines, $patches)
)

// Simulated state = on-chain state of the depots + patches produced by the local resolver
// We re-calculate every block based on the blocks passed since the last resolution
export const simulatedDepots = derived(
  [depots, patches, blocksSinceLastResolution, playerPod],
  ([$depots, $patches, $blocksSinceLastResolution, $playerPod]) =>
    calculateSimulatedDepots(
      $depots,
      $patches,
      $blocksSinceLastResolution,
      $playerPod
    )
)

export const simulatedConnections = derived(
  simulatedMachines,
  $simulatedMachines => calculateSimulatedConnections($simulatedMachines)
)

export const networkIsRunning = derived(
  [simulatedDepots, playerPod, simulatedMachines],
  ([$simulatedDepots, $playerPod, $simulatedMachines]) => {
    if (!$playerPod?.fixedEntities) return false

    const outletKey = $playerPod?.fixedEntities?.outlet
    const outletEntity = $simulatedMachines[outletKey]
    if (!outletKey || !outletEntity) return false

    /*
     * If the outlet has no output, the network is not running
     */
    if (!outletEntity.outputs) return false
    const outletOutput = outletEntity.outputs[0]
    if (!outletOutput) return false

    /*
     * If the outlet is not connected to a depot, the network is not running
     */
    const outletDepot = Object.values($simulatedDepots).find(
      depot => depot.depotConnection === outletKey
    )
    if (!outletDepot) return false

    /*
     * If the output depot is full, the network is not running
     */
    if (outletDepot.amount == DEPOT_CAPACITY) return false

    /*
     * Get used inlet depots
     * If any of the used inlet depots are empty, the network is not running
     */
    const inletKeys = $playerPod?.fixedEntities?.inlets
    let usedInletKeys: string[] = []
    for (let i = 0; i < outletOutput.inletActive.length; i++) {
      if (outletOutput.inletActive[i]) {
        usedInletKeys.push(inletKeys[i])
      }
    }
    const usedInletDepots = Object.values($simulatedDepots).filter(depot =>
      usedInletKeys.includes(depot.depotConnection)
    )

    /*
     * If any of the used inlet depots are empty, the network is not running
     */
    for (let i = 0; i < usedInletDepots.length; i++) {
      if (usedInletDepots[i].amount == 0) return false
    }

    /*
     * All conditions met, the network is running
     */
    return true
  }
)

export const playerOrder = derived(
  [player, orders, playerPod, availableOrders],
  ([$player, $orders, $playerPod, $availableOrders]) => {
    if (!$player || !$orders || !$playerPod || !$availableOrders) return null

    return $player.tutorial
      ? $orders[$playerPod.currentOrder]
      : $availableOrders[$playerPod.currentOrder]
  }
)

// Can a depot ship?
export const shippableDepots = derived(
  [blockNumber, simulatedDepots, playerOrder],
  ([$blockNumber, $simulatedDepots, $playerOrder]) => {
    if (!$blockNumber) return {}
    return Object.fromEntries(
      Object.entries($simulatedDepots).map(([_, depot]) => {
        if (
          depot.materialType === $playerOrder?.order.goalMaterialType &&
          depot.amount >= $playerOrder?.order.goalAmount
        ) {
          return [_, true]
        }
        return [_, false]
      })
    )
  }
)

export const depotAttachments = derived(
  [simulatedDepots, playerPod],
  ([$simulatedDepots, $playerPod]) => {
    const results: Attachment[] = []

    const getConnectionName = (machineEntity: string) => {
      if (!$playerPod?.fixedEntities) return "none"
      if ($playerPod?.fixedEntities.inlets.includes(machineEntity)) return "I"
      if (machineEntity === $playerPod?.fixedEntities.outlet) return "O"
      return "none"
    }

    return Object.fromEntries(
      Object.entries($simulatedDepots)
        .map(([address, depot]) => {
          if (depot.depotConnection !== EMPTY_CONNECTION) {
            return [
              address,
              {
                depot: address,
                machine: depot.depotConnection,
                name: getConnectionName(depot.depotConnection),
              },
            ]
          }

          return [address, false]
        })
        .filter(([_, value]) => !!value)
    )
  }
)
