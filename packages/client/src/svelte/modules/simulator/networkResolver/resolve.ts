import { get } from "svelte/store"
import { MACHINE_TYPE, MATERIAL_TYPE } from "../../state/enums"
import { machinesInPlayerPod } from "../../state"
import { process } from "./machines"
import type { Product, SimulatedEntities } from "../types"
import { deepClone } from "../../utils/misc"

/**
 * Resolves the state of a given pod entity.
 * This function simulates a process within a system of machines that interact with each other.
 * It processes the materials through the network of machines until all machines are resolved.
 *
 * @param _podEntity - Identifier for the pod entity to be resolved.
 */
export function resolve(_podEntity: string) {
  // console.log('############################')
  // console.log('############################')

  // Counter for the number of iterations over the network
  let iterationCounter = 0

  // Get all the machines in the pod
  const machines = get(machinesInPlayerPod)

  // console.log('machines', machines)

  // List to keep track of nodes (machines) that have processed their inputs
  const resolvedNodes: string[] = []

  // Inputs for machines
  let inputs: Product[] = []

  // Store the products for intermediary state
  // Only used for frontend display, not used in actual resolution
  // @todo: use a single patch array
  let patchOutputs: Product[] = []
  let patchInputs: Product[] = []

  // Iterate until all machines in the network are resolved
  while (resolvedNodes.length < Object.keys(machines).length) {
    // console.log('*** ITERATION', iterationCounter)

    // For each machine in the list
    Object.entries(machines).forEach(([machineKey, machine]) => {
      // console.log('___ RESOLVING MACHINE', MACHINE_TYPE[machine.machineType], machine.buildIndex, machine)

      // Skip if node is already resolved
      if (resolvedNodes.includes(machineKey)) {
        // console.log('___ ALREADY RESOLVED')
        return
      }

      // If the machine is an inlet, provide it with bugs as input.
      if (machine.machineType === MACHINE_TYPE.INLET) {
        inputs.push({
          machineId: machineKey,
          materialType: MATERIAL_TYPE.BUG,
          amount: 100,
        })
      }

      // Gather all the inputs for the current machine.
      const currentInputs = inputs.filter(
        input => input.machineId === machineKey
      )

      // console.log('___ currentInputs', currentInputs)

      // if (machine.machineType === MACHINE_TYPE.MIXER) {
      //   console.log('!!!! MIXER')
      //   console.log('inputs', inputs)
      //   console.log('currentInputs', currentInputs)
      // }

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
      const currentOutputs = process(machine.machineType, currentInputs)

      // Save to patchOutputs
      for (let k = 0; k < currentOutputs.length; k++) {
        patchOutputs.push(deepClone(currentOutputs[k]))
      }
      // console.log('___ currentOutputs', currentOutputs)

      // Mark the machine as resolved.
      resolvedNodes.push(machineKey)

      // Distribute the machine's outputs to the connected machines.
      for (let k = 0; k < machine.outgoingConnections.length; k++) {

        // No connection
        if (machine.outgoingConnections[k] === "0") continue

        // Fill output
        if (currentOutputs[k]?.materialType !== MATERIAL_TYPE.NONE) {
          const output = currentOutputs[k]
          // console.log('___ output', output)
          if (output) {
            output.machineId = machine.outgoingConnections[k]
            inputs.push(output)
          }
        }
      }
    })

    // Increment the counter.
    iterationCounter++
    // Break out of the loop if it seems like an infinite loop is occurring.
    if (iterationCounter === Object.values(machines).length * 2) {
      // console.log('!!!!! BREAKING OUT OF LOOP')
      break
    }
  }

  // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
  // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%')

  let patches = {} as SimulatedEntities

  aggregateAndOrganize(patchOutputs, "machineId", "outputs", patches)
  aggregateAndOrganize(patchInputs, "machineId", "inputs", patches)

  return patches
}

/**
 * Aggregates and organizes data from an array based on provided key and field, updating the `patches` object.
 * @param {any[]} dataArray - The array of data to process.
 * @param {string} key - The property name within each data item to use as a key for grouping in `patches`.
 * @param {string} field - The property name in `patches` where the aggregated data should be stored.
 * @param {SimulatedEntities} patches - An object that gets populated or updated based on `dataArray`.
 */
function aggregateAndOrganize(
  dataArray: any[],
  key: string,
  field: string,
  patches: SimulatedEntities
) {
  for (let i = 0; i < dataArray.length; i++) {
    if (!patches[dataArray[i][key]]) {
      patches[dataArray[i][key]] = {}
      patches[dataArray[i][key]][field] = []
    }

    if (!patches[dataArray[i][key]][field]) {
      patches[dataArray[i][key]][field] = []
    }

    patches[dataArray[i][key]][field].push(dataArray[i])
  }
}
