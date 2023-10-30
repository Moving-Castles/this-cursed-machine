import { get } from "svelte/store"
import { MachineType, MaterialType, PortType } from "../../state/enums"
import { machinesInPlayerBox, ports, connections } from "../../state"
import { process } from "./machines"
import type { Product, SimulatedEntities } from "../types"
import { deepClone } from "../../utils/misc"
import { playerEnergyMod } from ".."

/**
 * Resolves the state of a given box entity.
 * This function simulates a process within a system of machines that interact with each other.
 * It processes the materials through the network of machines until all machines are resolved.
 *
 * @param _boxEntity - Identifier for the box entity to be resolved.
 */
export function resolve(_boxEntity: string) {

  // console.log('############################')
  // console.log('############################')

  // Counter for the number of iterations over the network
  let iterationCounter = 0

  // Get all the machines associated with the box entity.
  const machines = get(machinesInPlayerBox)

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
  let connectionPatches: any[] = []
  let inputPortPatches: any[] = []
  let outputPortPatches: any[] = []

  // Iterate until all machines in the network are resolved
  while (resolvedNodes.length < Object.keys(machines).length) {

    // console.log('*** ITERATION', iterationCounter)

    // For each machine in the list
    Object.entries(machines).forEach(([machineKey, machine]) => {

      // console.log('___ RESOLVING MACHINE', MachineType[machine.machineType], machine.buildIndex, machine)

      // Skip if node is already resolved
      if (resolvedNodes.includes(machineKey)) {
        // console.log('___ ALREADY RESOLVED')
        return
      }

      // If the machine is an inlet, provide it with bugs as input.
      if (machine.machineType === MachineType.INLET) {
        inputs.push({
          machineId: machineKey,
          materialType: MaterialType.BUG,
          amount: 100,
        })
      }

      // Gather all the inputs for the current machine.
      const currentInputs = inputs.filter(
        input => input.machineId === machineKey
      )

      // console.log('___ currentInputs', currentInputs)

      // if (machine.machineType === MachineType.MIXER) {
      //   console.log('!!!! MIXER')
      //   console.log('inputs', inputs)
      //   console.log('currentInputs', currentInputs)
      // }

      // Skip if node has no input
      if (currentInputs.length === 0) {
        if (machine.machineType === MachineType.CORE) {
          // If machine is a core, set energy modifier to -1
          playerEnergyMod.set(-1)
        }
        return
      }

      // If this is a mixer and it has less than two inputs:
      // skip without marking as resolved to avoid missing the second input
      if (machine.machineType === MachineType.MIXER && currentInputs.length < 2) return;

      // Save to patchInputs
      for (let k = 0; k < currentInputs.length; k++) {
        patchInputs.push(deepClone(currentInputs[k]))
      }

      // Process the inputs of the machine to get the outputs
      const currentOutputs = process(machine.machineType, currentInputs)

      // Save to patchInputs
      for (let k = 0; k < currentOutputs.length; k++) {
        patchOutputs.push(deepClone(currentOutputs[k]))
      }

      // console.log('___ currentOutputs', currentOutputs)

      // Mark the machine as resolved.
      resolvedNodes.push(machineKey)

      // Find the output ports on the current machine
      let machinePorts: string[] = []
      Object.entries(get(ports)).forEach(([portKey, port]) => {
        if (port.portType == PortType.OUTPUT && port.carriedBy == machineKey) {
          machinePorts.push(portKey)
        }
      })

      // console.log('___ machinePorts', machinePorts)

      // No output ports were found
      if (machinePorts.length === 0) return

      // Distribute the machine's outputs to the connected machines.
      for (let k = 0; k < machinePorts.length; k++) {

        // Save to outpoutPortPatches: output(s) on output port
        outputPortPatches.push({
          portId: machinePorts[k],
          outputs: currentOutputs[k],
        })

        // Find connections going from that port
        const outgoingConnection = Object.entries(get(connections)).find(
          ([key, entity]) => entity.sourcePort === machinePorts[k]
        )

        // console.log('___ outgoingConnection', outgoingConnection)

        // No connection
        if (!outgoingConnection) continue

        // Save to connectionPatches
        connectionPatches.push({
          connectionId: outgoingConnection[0],
          inputs: currentOutputs[k],
        })

        // Get the port on the other end of the connection
        const inputPort = outgoingConnection[1].targetPort

        // console.log('___ inputPort', inputPort)

        // Save to inputPortPatches: output product(s) on input port
        inputPortPatches.push({
          portId: inputPort,
          inputs: currentOutputs[k],
        })

        // Get the machine that the port is on
        const targetEntity = get(ports)[inputPort].carriedBy

        // console.log('___ targetEntity', targetEntity)

        // Fill output
        if (currentOutputs[k]?.materialType !== MaterialType.NONE) {
          const output = currentOutputs[k]
          // console.log('___ output', output)
          if (output) {
            output.machineId = targetEntity
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

  aggregateAndOrganize(patchOutputs, 'machineId', 'outputs', patches);
  aggregateAndOrganize(patchInputs, 'machineId', 'inputs', patches);
  aggregateAndOrganize(connectionPatches, 'connectionId', 'inputs', patches);
  aggregateAndOrganize(inputPortPatches, 'portId', 'inputs', patches);
  aggregateAndOrganize(outputPortPatches, 'portId', 'outputs', patches);

  return patches
}

/**
 * Aggregates and organizes data from an array based on provided key and field, updating the `patches` object.
 * @param {any[]} dataArray - The array of data to process.
 * @param {string} key - The property name within each data item to use as a key for grouping in `patches`.
 * @param {string} field - The property name in `patches` where the aggregated data should be stored.
 * @param {SimulatedEntities} patches - An object that gets populated or updated based on `dataArray`.
 */
function aggregateAndOrganize(dataArray: any[], key: string, field: string, patches: SimulatedEntities) {
  for (let i = 0; i < dataArray.length; i++) {
    if (!patches[dataArray[i][key]]) {
      patches[dataArray[i][key]] = {};
      patches[dataArray[i][key]][field] = [];
    }

    if (!patches[dataArray[i][key]][field]) {
      patches[dataArray[i][key]][field] = [];
    }

    patches[dataArray[i][key]][field].push(dataArray[i]);

    if (key === 'connectionId') {
      patches[dataArray[i][key]].connection = true;
    }

    if (key === 'portId') {
      patches[dataArray[i][key]].port = true;
    }
  }
}