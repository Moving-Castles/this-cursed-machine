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
  // console.log('____ Resolving at block', get(blockNumber));

  // Counter for the number of iterations over the network
  let iterationCounter = 0

  // Get all the machines associated with the box entity.
  const machines = get(machinesInPlayerBox)

  // List to keep track of nodes (machines) that have processed their inputs
  const resolvedNodes: string[] = []

  // Inputs for machines
  let inputs: Product[] = []

  // Store the products for intermediary state
  let patchOutputs: Product[] = []
  let patchInputs: Product[] = []
  let connectionPatches: any[] = []

  // console.log("AT START")
  // console.log("resolvedNodes")
  // console.log(resolvedNodes)

  // Iterate until all machines in the network are resolved
  while (resolvedNodes.length < Object.keys(machines).length) {
    // console.log('__ Iteration', iterationCounter)

    // For each machine in the list
    Object.entries(machines).forEach(([machineKey, machine]) => {
      // Skip if node is already resolved
      if (resolvedNodes.includes(machineKey)) {
        return
      }

      // console.log('**********************')
      // console.log('**********************')
      // console.log('** Processing machine_', shortenAddress(machineKey), 'type:', MachineType[machine.machineType])

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

      // Save to patchInputs
      for (let k = 0; k < currentInputs.length; k++) {
        // console.log('&& Input', k);
        // console.log('&& machineId', shortenAddress(currentInputs[k].machineId));
        // console.log('&& materialType', MaterialType[currentInputs[k].materialType]);
        // console.log('&& amount', currentInputs[k].amount);
        // console.log('&&&&&&&&&&')
        patchInputs.push(deepClone(currentInputs[k]))
      }

      // Node has no input
      if (currentInputs.length === 0) {
        if (machine.machineType === MachineType.CORE) {
          // If machine is a core, set energy modifier to -1
          playerEnergyMod.set(-1)
        }
        // Skip
        return
      }

      // Process the inputs of the machine to get the outputs
      const currentOutputs = process(machine.machineType, currentInputs)

      // Save to patchInputs
      for (let k = 0; k < currentOutputs.length; k++) {
        // console.log('%% Output', k);
        // console.log('%% machineId', shortenAddress(currentOutputs[k].machineId));
        // console.log('%% materialType', MaterialType[currentOutputs[k].materialType]);
        // console.log('%% amount', currentOutputs[k].amount);
        // console.log('%%%%%%%%%%')
        patchOutputs.push(deepClone(currentOutputs[k]))
      }

      // Mark the machine as resolved.
      resolvedNodes.push(machineKey)

      // Find the output ports on the current machine
      let machinePorts: string[] = []
      Object.entries(get(ports)).forEach(([portKey, port]) => {
        // console.log('=1', port.carriedBy)
        // console.log('=2', machineKey)
        // console.log('port.portType === PortType.OUTPUT', port.portType === PortType.OUTPUT)
        // console.log('port.carriedBy == machineKey', port.carriedBy == machineKey)
        if (port.portType == PortType.OUTPUT && port.carriedBy == machineKey) {
          machinePorts.push(portKey)
        }
      })

      // No output ports were found
      if (machinePorts.length === 0) return

      // Distribute the machine's outputs to the connected machines.
      for (let k = 0; k < machinePorts.length; k++) {
        // console.log("machinePorts[k]", machinePorts[k])

        //  Find connections going from that port
        const outgoingConnection = Object.entries(get(connections)).find(
          ([key, entity]) => entity.sourcePort === machinePorts[k]
        )

        // No connection
        if (!outgoingConnection) continue

        // Make connection patches
        connectionPatches.push({
          connectionId: outgoingConnection[0],
          inputs: currentOutputs[k],
        })

        //  Get the port on the other end of the connection
        const inputPort = outgoingConnection[1].targetPort

        //  Get the machine that the port is on
        const targetEntity = get(ports)[inputPort].carriedBy

        // Fill output
        if (currentOutputs[k]?.materialType !== MaterialType.NONE) {
          const output = currentOutputs[k]
          if (output) {
            output.machineId = targetEntity
            inputs.push(output)
          }
        }
      }

      // console.log('**********************')
      // console.log('**********************')
    })

    // Increment the counter.
    iterationCounter++
    // Break out of the loop if it seems like an infinite loop is occurring.
    if (iterationCounter === Object.values(machines).length * 2) break
  }

  let patches = {} as SimulatedEntities

  aggregateAndOrganize(patchOutputs, 'machineId', 'outputs', patches);
  aggregateAndOrganize(patchInputs, 'machineId', 'inputs', patches);
  aggregateAndOrganize(connectionPatches, 'connectionId', 'inputs', patches);

  // console.log("____ FINAL PATCHES", patches)

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
  }
}