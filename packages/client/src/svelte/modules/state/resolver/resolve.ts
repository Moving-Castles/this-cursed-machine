import { MACHINE_TYPE, MATERIAL_TYPE } from "../base/enums"
import type { Product } from "./patches/types"
import type { SimulatedEntities } from "../simulated/types"
import { process } from "./machines"
import { deepClone } from "@modules/utils"
import { EMPTY_CONNECTION } from "@modules/utils/constants"

import { organizePatches, consolidatePatches, createOutletDepotPatches, createInletDepotPatches, backtraceOutletConnection } from "./patches"

const FLOW_RATE = 1000

/**
 * Processes the materials through the network of machines until all machines are resolved.
 *
 * Should work the same as contracts/src/libraries/LibNetwork.sol:resolve
 * 
 * @returns Patches to be applied to the state to reflect the resolved state of the pod
 */
export function resolve(machines: Machines, inlets: Machines, outlets: Machines, depots: Depots, recipes: Recipe[]): SimulatedEntities {

  // Counter for the number of iterations over the network
  let iterationCounter = 0

  // List to keep track of nodes (machines) that have processed their inputs
  const resolvedNodes: string[] = []

  // Inputs for machines
  let inputs: Product[] = []

  // Set to true in the resolve loop if there is a connection between the inlet and the outlet,
  // and both orifices are connected to depots
  let circuitClosed = false

  // Store the products for intermediary state
  // Only used for frontend display, not used in actual resolution
  let patchOutputs: Product[] = []
  let patchInputs: Product[] = []

  const inletDepots = Object.values(inlets).map(inlet => inlet?.depotConnection ?? null)
  const outletDepots = Object.values(outlets).map(outlet => outlet?.depotConnection ?? null)

  // Abort early if neither inlets are connected to depot or if outlet is not connected to depot
  // if (inletDepots.every(depot => depot === null) || outletDepots.every(depot => depot === null)) return {} as SimulatedEntities

  // Iterate until all machines in the network are resolved
  while (resolvedNodes.length < Object.keys(machines).length) {

    // For each machine in the list
    Object.entries(machines).forEach(([machineKey, machine]) => {

      // Skip if node is already resolved
      if (resolvedNodes.includes(machineKey)) return

      // Handle inlets
      if (machine.machineType === MACHINE_TYPE.INLET) {

        // Is it inlet one or two?
        let inletIndex = machineKey == Object.keys(inlets)[0] ? 0 : 1;

        let depot = inletDepots[inletIndex]

        // Skip if inlet is not connected to depot
        if (!depot || depot == EMPTY_CONNECTION) return

        const newInletActive: boolean[] = [false, false]
        // Set active for inlet
        newInletActive[inletIndex] = true

        inputs.push({
          machineId: machineKey,
          sourceMachineId: null,
          materialType: depots[depot].materialType,
          amount: FLOW_RATE,
          inletActive: newInletActive
        })
      }

      // Gather all the inputs for the current machine.
      const currentInputs = inputs.filter(input => input.machineId === machineKey)

      // Skip if node has no input
      if (currentInputs.length === 0) return

      // If this is a mixer and it has less than two inputs:
      // skip without marking as resolved to avoid missing the second input
      if (machine.machineType === MACHINE_TYPE.MIXER && currentInputs.length < 2)
        return

      // Save to patchInputs
      for (let k = 0; k < currentInputs.length; k++) {
        patchInputs.push(deepClone(currentInputs[k]))
      }

      // Process the inputs of the machine to get the outputs
      const currentOutputs = process(machine.machineType, currentInputs, recipes)

      // Save to patchOutputs
      for (let k = 0; k < currentOutputs.length; k++) {
        patchOutputs.push(deepClone(currentOutputs[k]))
      }

      // Mark the machine as resolved.
      resolvedNodes.push(machineKey)

      // Handle outlet
      if (machine.machineType === MACHINE_TYPE.OUTLET) {
        // Continue if no output
        if (currentOutputs[0].materialType == MATERIAL_TYPE.NONE) return;

        // We have reached the outlet, and it is connect to a depot, so circuit is closed
        if (machine.depotConnection && machine.depotConnection !== EMPTY_CONNECTION) {
          circuitClosed = true;
        }
      }

      // Distribute the machine's outputs to the connected machines.
      for (let k = 0; k < machine.outgoingConnections.length; k++) {

        // No connection
        if (machine.outgoingConnections[k] === "0") continue

        // Fill output
        if (currentOutputs[k]?.materialType !== MATERIAL_TYPE.NONE) {
          const output = currentOutputs[k]
          if (output) {
            output.sourceMachineId = machineKey
            output.machineId = machine.outgoingConnections[k]
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
  * Special treatment is given to the depots.
  */
  return backtraceOutletConnection(
    consolidatePatches([
      organizePatches(patchInputs, "machineId", "inputs"),
      organizePatches(patchOutputs, "machineId", "outputs"),
      createOutletDepotPatches(circuitClosed, patchOutputs, Object.keys(outlets)[0], outletDepots[0]),
      createInletDepotPatches(circuitClosed, patchInputs, Object.keys(inlets), machines)
    ]),
    Object.keys(outlets)[0])
}
