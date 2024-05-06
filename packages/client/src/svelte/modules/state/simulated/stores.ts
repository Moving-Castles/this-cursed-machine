import { derived } from "svelte/store"
import { deepClone } from "@modules/utils/"
import { storableArray } from "@modules/utils/storable"
import { EMPTY_CONNECTION } from "@modules/utils/constants"
import { BUG_MATERIAL } from "@modules/ui/constants"
import { MaterialIdNone } from "@modules/state/base/constants"
import { blockNumber } from "@modules/network"
import { ONE_UNIT } from "@modules/ui/constants"

import type {
  SimulatedEntities,
  SimulatedTanks,
  SimulatedTank,
  SimulatedMachines,
  Connection,
  SimulatedMachine,
  Attachment,
} from "./types"
import {
  machines,
  tanks,
  playerPod,
  player,
  orders,
  availableOrders,
  materialMetadata,
} from "@modules/state/base/stores"
import { patches } from "@modules/state/resolver/patches/stores"
import { blocksSinceLastResolution } from "@modules/state/resolver/stores"
import { GRAPH_ENTITY_STATE } from "./enums"
import { FLOW_RATE, TANK_CAPACITY } from "@modules/state/simulated/constants"

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
    if (output.materialId === MaterialIdNone) continue
    updatedEntity.products.push({
      materialId: output.materialId,
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
    ([_, patch]) => !patch.tank
  )

  // Iterate over each patch in the patches store.
  for (const [key, patch] of filteredPatches) {
    simulatedMachines = processInputPatches(simulatedMachines, key, patch)
    simulatedMachines = processOutputPatches(simulatedMachines, key, patch)
  }

  // Return the updated simulated state.
  return simulatedMachines
}

export function calculateSimulatedTanks(
  tanks: Tanks,
  patches: SimulatedEntities,
  blocksSinceLastResolution: bigint,
  playerPod: Pod
): SimulatedTanks {
  /*
   * This function updates the inlet and outlet tanks
   *
   * Should work the same as contracts/src/libraries/LibTank.sol:write
   *
   * Generally the output is what is produced by the outlet machine * blocks past
   *
   * But, we need to take into account the following limiting factors:
   * - The amount of material in the inlet tanks
   * - The capacity of the outlet tank
   *
   * We need to find the lowest of the two limiting factors and cap the number of blocks by that
   */

  // Create deep copy to avoid accidentally mutating the original object.
  const initialTanksCopy = deepClone(tanks)

  const simulatedTanks: SimulatedTanks = Object.fromEntries([
    ...Object.entries(initialTanksCopy),
  ])

  // Abort if the player's pod is not set up properly
  if (!playerPod?.fixedEntities) return simulatedTanks

  // Get tank connected to the outlet
  const outletTank = Object.entries(initialTanksCopy).filter(
    ([_, tank]) => tank.tankConnection === playerPod?.fixedEntities.outlet
  )

  // Get tanks connected to the inlets
  const inletTanks = Object.entries(initialTanksCopy).filter(([_, tank]) =>
    playerPod?.fixedEntities.inlets.includes(tank.tankConnection)
  )

  // Get patches for depois
  const tankPatches = Object.entries(patches).filter(([_, patch]) => patch.tank)

  // Abort if either of these are empty
  if (
    outletTank.length === 0 ||
    inletTanks.length === 0 ||
    tankPatches.length === 0
  ) {
    return simulatedTanks
  }

  const outletTankPatch = tankPatches.find(
    ([key, _]) => key == outletTank[0][0]
  )

  // Abort if the outlet tank does not have a patch
  if (!outletTankPatch) return simulatedTanks

  /*
   * Filter out the inlet tanks that are not contributing to the output
   */
  const usedInletTanks = getUsedInletTanks(
    inletTanks,
    playerPod.fixedEntities.inlets,
    tankPatches
  )
  const usedInletTanksKeys = usedInletTanks.map(([key, _]) => key)

  const lowestInputAmount = findLowestValue(usedInletTanks)
  if (lowestInputAmount === BigInt(0)) return simulatedTanks

  /*
   * With a flow rate of FLOW_RATE per block,
   * how long does it take for the lowest input to be exhausted?
   */
  const inletExhaustionBlock = lowestInputAmount / FLOW_RATE

  /*
   * When is the outlet tank full?
   * available capacity of the tank / flow rate of the outlet product
   */
  const outletFullBlock =
    (TANK_CAPACITY - outletTank[0][1].amount) /
    outletTankPatch[1].inputs[0].amount

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

  for (const [key, patch] of tankPatches) {
    if (!simulatedTanks[key]) continue

    /*
     * Write to outlet tank
     * Add if material is same, otherwise replace
     */
    if (Array.isArray(patch.inputs) && patch.inputs[0]) {
      const patchInput = patch.inputs[0]
      const cumulativeOutputAmount = patchInput.amount * cappedBlocks
      if (initialTanksCopy[key].materialId === patchInput.materialId) {
        simulatedTanks[key].amount =
          (initialTanksCopy[key].amount ?? 0) + cumulativeOutputAmount
      } else {
        simulatedTanks[key].materialId = patchInput.materialId
        simulatedTanks[key].amount = cumulativeOutputAmount
      }
    }

    /*
     * Write to inlet tanks
     * Check that the inlet tank contributed to the output
     * Empty tank if we exhausted it
     */
    if (
      Array.isArray(patch.outputs) &&
      patch.outputs[0] &&
      usedInletTanksKeys.includes(key)
    ) {
      const consumedInletAmount = cappedBlocks * FLOW_RATE
      if (consumedInletAmount === initialTanksCopy[key].amount) {
        simulatedTanks[key].materialId = MaterialIdNone
        simulatedTanks[key].amount = BigInt(0)
      } else {
        simulatedTanks[key].amount =
          initialTanksCopy[key].amount - consumedInletAmount
      }
    }
  }

  // Return the updated simulated state.
  return simulatedTanks
}

function findLowestValue(usedInletTanks: [string, Tank][]): bigint {
  let lowestEntry: [string, Tank] | null = null

  for (const [key, tank] of usedInletTanks) {
    if (!lowestEntry || tank.amount < lowestEntry[1].amount) {
      lowestEntry = [key, tank]
    }
  }

  if (!lowestEntry) return BigInt(0)

  return lowestEntry[1].amount ?? BigInt(0)
}

/*
 * Checks the output patch of the outlet to see which inlets contributed to the output.
 * Then finds the tanks connected to those inlets
 */
function getUsedInletTanks(
  inletTanks: [string, Tank][],
  inlets: string[],
  tankPatches: [string, SimulatedTank][]
): [string, Tank][] {
  let inletActive: boolean[] | null = null
  let usedInletTanks: [string, Tank][] = []

  // Find the outlet patch – it is the only one with inputs
  for (const [, patch] of tankPatches) {
    if (Array.isArray(patch.inputs) && patch.inputs[0]) {
      // Get the boolean array indicating which of the inlets contributed to the final output
      inletActive = patch.inputs[0].inletActive
      break
    }
  }

  if (inletActive == null) return usedInletTanks

  // Iterate over the inlet tanks and check if the inlet it is connected is active
  for (let i = 0; i < inletTanks.length; i++) {
    const inletIndex = inlets.indexOf(inletTanks[i][1].tankConnection)

    if (inletActive[inletIndex]) {
      usedInletTanks.push(inletTanks[i])
    }
  }

  return usedInletTanks
}

export function calculateSimulatedConnections(
  simulatedMachines: SimulatedMachines
): Connection[] {
  let connections: Connection[] = []

  Object.entries(simulatedMachines).forEach(([sourceAddress, machine]) => {
    if (!machine?.outgoingConnections) return
    machine?.outgoingConnections.forEach((targetAddress, sourcePortIndex) => {
      if (targetAddress === EMPTY_CONNECTION) return

      const sourceMachine = simulatedMachines[sourceAddress]
      const targetMachine = simulatedMachines[targetAddress]

      if (!sourceMachine || !targetMachine) return connections

      if (!targetMachine?.incomingConnections) return connections

      const targetPortIndex = targetMachine?.incomingConnections
        ?.map((conn, i) => {
          // Map to a combined ID from the targetMachine's incoming port combined with the the port index...
          return `${conn}-${i}`
        })
        ?.findIndex(
          // ... because we need to make sure the index of our source port gets considered when connecting
          connection => connection === `${sourceAddress}-${sourcePortIndex}`
        )

      let connection: Connection = {
        id: `FROM-${sourceAddress}-TO-${targetAddress}-${sourcePortIndex}`,
        sourceMachine: sourceAddress,
        targetMachine: targetAddress,
        portIndex: {
          source: sourcePortIndex,
          target: targetPortIndex,
        },
        products: [],
        state: GRAPH_ENTITY_STATE.IDLE,
        productive: targetMachine.productive ?? false,
      }

      // If the source machine has an output:
      // Assign material and amount, and set state to active
      if (
        sourceMachine.outputs &&
        sourceMachine.outputs[sourcePortIndex] &&
        sourceMachine.outputs[sourcePortIndex].materialId !== MaterialIdNone
      ) {
        connection.products = [
          {
            materialId: sourceMachine.outputs[sourcePortIndex].materialId,
            amount: sourceMachine.outputs[sourcePortIndex].amount,
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

// Simulated state = on-chain state of the tanks + patches produced by the local resolver
// We re-calculate every block based on the blocks passed since the last resolution
export const simulatedTanks = derived(
  [tanks, patches, blocksSinceLastResolution, playerPod],
  ([$tanks, $patches, $blocksSinceLastResolution, $playerPod]) =>
    calculateSimulatedTanks(
      $tanks,
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
  [simulatedTanks, playerPod, simulatedMachines],
  ([$simulatedTanks, $playerPod, $simulatedMachines]) => {
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
     * If the outlet is not connected to a tank, the network is not running
     */
    const outletTank = Object.values($simulatedTanks).find(
      tank => tank.tankConnection === outletKey
    )
    if (!outletTank) return false

    /*
     * If the output tank is full, the network is not running
     */
    if (outletTank.amount == TANK_CAPACITY) return false

    /*
     * Get used inlet tanks
     * If any of the used inlet tanks are empty, the network is not running
     */
    const inletKeys = $playerPod?.fixedEntities?.inlets
    let usedInletKeys: string[] = []
    for (let i = 0; i < outletOutput.inletActive.length; i++) {
      if (outletOutput.inletActive[i]) {
        usedInletKeys.push(inletKeys[i])
      }
    }
    const usedInletTanks = Object.values($simulatedTanks).filter(tank =>
      usedInletKeys.includes(tank.tankConnection)
    )

    /*
     * If any of the used inlet tanks are empty, the network is not running
     */
    for (let i = 0; i < usedInletTanks.length; i++) {
      if (usedInletTanks[i].amount == BigInt(0)) return false
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
      ? $orders[$player.currentOrder]
      : $availableOrders[$player.currentOrder]
  }
)

// Can a tank ship?
export const shippableTanks = derived(
  [blockNumber, simulatedTanks, playerOrder],
  ([$blockNumber, $simulatedTanks, $playerOrder]) => {
    if (!$blockNumber) return {}
    return Object.fromEntries(
      Object.entries($simulatedTanks).map(([_, tank]) => {
        console.log($playerOrder)
        const exhausted =
          $playerOrder?.order?.maxPlayers > 0 &&
          ($playerOrder?.completedPlayers ?? 0) >=
            $playerOrder?.order.maxPlayers
        if (
          tank.materialId === $playerOrder?.order.materialId &&
          tank.amount >= $playerOrder?.order.amount &&
          !exhausted
        ) {
          return [_, true]
        }
        return [_, false]
      })
    )
  }
)

/** The amount of bugs tanks still can be filled with  */
export const capacityForBugs = derived(
  [simulatedTanks],
  ([$simulatedTanks]) => {
    const t = Object.values($simulatedTanks).filter(tank => {
      return (
        tank.materialId === BUG_MATERIAL || tank.materialId === MaterialIdNone
      )
    })

    const total =
      t
        .map(tank => {
          // if the tank material is bugs, or if the tank material is non existent
          return tank.amount
        })
        .reduce((total, next) => (total += next)) / ONE_UNIT

    return t?.length * 500 - Number(total)
  }
)

/** Can fill? */
export const usedCapacity = derived([simulatedTanks], ([$simulatedTanks]) => {
  const usedCapacity =
    Object.values($simulatedTanks)
      .map(tank => tank.amount)
      .reduce((total, current) => (total += current)) / ONE_UNIT

  return usedCapacity
})

export const tankAttachments = derived(
  [simulatedTanks, playerPod],
  ([$simulatedTanks, $playerPod]) => {
    const getConnectionName = (machineEntity: string) => {
      if (!$playerPod?.fixedEntities) return "none"
      if ($playerPod?.fixedEntities.inlets.includes(machineEntity)) return "I"
      if (machineEntity === $playerPod?.fixedEntities.outlet) return "O"
      return "none"
    }

    return Object.fromEntries(
      Object.entries($simulatedTanks)
        .map(([address, tank]) => {
          if (tank.tankConnection !== EMPTY_CONNECTION) {
            return [
              address,
              {
                tank: address,
                machine: tank.tankConnection,
                name: getConnectionName(tank.tankConnection),
              },
            ]
          }

          return [address, false]
        })
        .filter(([_, value]) => !!value)
    )
  }
)

/** Return the currently flowing outputs */
export const podOutputs = derived(
  [simulatedMachines, playerPod, materialMetadata],
  ([$simulatedMachines, $playerPod, $materialMetadata]) => {
    const flowingMaterials: MaterialMetadata[] = []

    const m: [string, SimulatedMachine][] = Object.entries($simulatedMachines)

    m.forEach(([_, machine]) => {
      machine?.products?.forEach(product => {
        flowingMaterials.push($materialMetadata[product.materialId])
      })
    })

    return [...new Set(flowingMaterials)]
  }
)

export const machineCapacity = derived(
  [simulatedMachines],
  ([$simulatedMachines]) => {
    return 14 - Object.values($simulatedMachines).length
  }
)

export const discoveredMaterials = storableArray(
  [BUG_MATERIAL], // Bugs are not new to us
  "tcm_discoveredMaterials"
)

export const discoveredMessages = storableArray(
  [], // Bugs are not new to us
  "tcm_discoveredMessages"
)
