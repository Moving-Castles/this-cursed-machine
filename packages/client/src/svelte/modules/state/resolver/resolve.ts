import type { Product } from "./patches/types"
import type { SimulatedEntities } from "../simulated/types"
import { get } from "svelte/store"
import { MACHINE_TYPE } from "../base/enums"
import { MaterialIdNone } from "../base/constants"
import { process } from "./machines"
import { deepClone } from "@modules/utils"
import { EMPTY_CONNECTION } from "@modules/utils/constants"
import { FLOW_RATE } from "@modules/state/simulated/constants"

import {
  organizePatches,
  consolidatePatches,
  createOutletTankPatches,
  createInletTankPatches,
  backtraceOutletConnection,
} from "./patches"

/**
 * Processes the materials through the network of machines until all machines are resolved.
 *
 * Should work the same as contracts/src/libraries/LibNetwork.sol:resolve
 *
 * @returns Patches to be applied to the state to reflect the resolved state of the pod
 */
export function resolve(
  machines: Machines,
  inlets: Machines,
  outlets: Machines,
  tanks: Tanks,
  recipes: Recipe[]
): SimulatedEntities {
  // Counter for the number of iterations over the network
  let iterationCounter = 0

  // List to keep track of nodes (machines) that have processed their inputs
  const resolvedNodes: string[] = []

  // Inputs for machines
  let inputs: Product[] = []

  // Set to true in the resolve loop if there is a connection between the inlet and the outlet,
  // and both orifices are connected to tanks
  let circuitClosed = false

  // Store the products for intermediary state
  // Only used for frontend display, not used in actual resolution
  let patchOutputs: Product[] = []
  let patchInputs: Product[] = []

  const inletTanks = Object.values(inlets).map(
    inlet => inlet?.tankConnection ?? null
  )
  const outletTanks = Object.values(outlets).map(
    outlet => outlet?.tankConnection ?? null
  )

  // Abort early if neither inlets are connected to tank or if outlet is not connected to tank
  // if (inletTanks.every(tank => tank === null) || outletTanks.every(tank => tank === null)) return {} as SimulatedEntities

  // Iterate until all machines in the network are resolved
  while (resolvedNodes.length < Object.keys(machines).length) {
    // For each machine in the list
    Object.entries(machines).forEach(([machineKey, machine]) => {
      // Skip if node is already resolved
      if (resolvedNodes.includes(machineKey)) return

      // Handle inlets
      if (machine.machineType === MACHINE_TYPE.INLET) {
        // Is it inlet one or two?
        let inletIndex = machineKey == Object.keys(inlets)[0] ? 0 : 1

        let tank = inletTanks[inletIndex]

        // Skip if inlet is not connected to tank
        if (!tank || tank == EMPTY_CONNECTION) return

        const newInletActive: boolean[] = [false, false]
        // Set active for inlet
        newInletActive[inletIndex] = true

        inputs.push({
          machineId: machineKey,
          sourceMachineId: null,
          materialId: tanks[tank].materialId,
          amount: FLOW_RATE,
          inletActive: newInletActive,
        })
      }

      // Gather all the inputs for the current machine.
      const currentInputs = inputs.filter(
        input => input.machineId === machineKey
      )

      // console.log('currentInputs', currentInputs)

      // Skip if node has no input
      if (currentInputs.length === 0) return

      // If this is a mixer and it has less than two inputs:
      // skip without marking as resolved to avoid missing the second input
      if (
        machine.machineType === MACHINE_TYPE.MIXER &&
        currentInputs.length < 2
      )
        return

      // Save to patchInputs
      for (let k = 0; k < currentInputs.length; k++) {
        patchInputs.push(deepClone(currentInputs[k]))
      }

      // Process the inputs of the machine to get the outputs
      const currentOutputs = process(
        machine.machineType,
        currentInputs,
        recipes
      )

      // Save to patchOutputs and check if we know this material
      for (let k = 0; k < currentOutputs.length; k++) {
        patchOutputs.push(deepClone(currentOutputs[k]))
      }

      // Mark the machine as resolved.
      resolvedNodes.push(machineKey)

      // Handle outlet
      if (machine.machineType === MACHINE_TYPE.OUTLET) {
        // Continue if no output
        if (currentOutputs[0].materialId == MaterialIdNone) return

        // We have reached the outlet, and it is connect to a tank, so circuit is closed
        if (
          machine.tankConnection &&
          machine.tankConnection !== EMPTY_CONNECTION
        ) {
          circuitClosed = true
        }
      }

      // Distribute the machine's outputs to the connected machines.
      for (let k = 0; k < machine?.outgoingConnections.length; k++) {
        // No connection
        if (machine?.outgoingConnections?.[k] === EMPTY_CONNECTION) continue

        // Fill output
        if (currentOutputs[k]?.materialId !== MaterialIdNone) {
          const output = currentOutputs[k]
          if (output) {
            output.sourceMachineId = machineKey
            output.machineId = machine?.outgoingConnections?.[k]
            inputs.push(output)
          }
        }
      }
    })

    // Increment the counter.
    iterationCounter++
    // Break out of the loop if it seems like an infinite loop is occurring.
    if (iterationCounter === Object.values(machines).length * 2) break
  }

  /*
   * We take the patches produced by the resolution and organize them into a structure that can be applied to the state.
   * Special treatment is given to the tanks.
   */
  return backtraceOutletConnection(
    consolidatePatches([
      organizePatches(patchInputs, "machineId", "inputs"),
      organizePatches(patchOutputs, "machineId", "outputs"),
      createOutletTankPatches(
        circuitClosed,
        patchOutputs,
        Object.keys(outlets)[0],
        outletTanks[0]
      ),
      createInletTankPatches(
        circuitClosed,
        patchInputs,
        Object.keys(inlets),
        machines
      ),
    ]),
    Object.keys(outlets)[0]
  )
}
