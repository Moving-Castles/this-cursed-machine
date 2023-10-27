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

  console.log("AT START")
  console.log("resolvedNodes")
  console.log(resolvedNodes)


  // Iterate until all machines in the network are resolved
  while (resolvedNodes.length < Object.keys(machines).length) {
    console.log('__ Iteration', iterationCounter)

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
        const outgoingConnection = Object.values(get(connections)).find(
          entity => entity.sourcePort === machinePorts[k]
        ) as Connection

        // console.log("outgoingConnection", outgoingConnection)

        // No connection
        if (!outgoingConnection) continue

        //  Get the port on the other end of the connection
        const inputPort = outgoingConnection.targetPort

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

  console.log("patchOutputs", "patchInputs")
  console.log(patchOutputs, patchInputs)

  // @todo: work on patch system...

  let patches = {} as SimulatedEntities

  // Aggregate and organize patch outputs.
  for (let i = 0; i < patchOutputs.length; i++) {
    if (!patches[patchOutputs[i].machineId]) {
      patches[patchOutputs[i].machineId] = {
        outputs: [],
      }
    }

    if (!patches[patchOutputs[i].machineId].outputs) {
      patches[patchOutputs[i].machineId].outputs = []
    }

    patches[patchOutputs[i].machineId].outputs.push(patchOutputs[i])
  }

  // Aggregate and organize patch inputs.
  for (let i = 0; i < patchInputs.length; i++) {
    if (!patches[patchInputs[i].machineId]) {
      patches[patchInputs[i].machineId] = {
        inputs: [],
      }
    }

    if (!patches[patchInputs[i].machineId].inputs) {
      patches[patchInputs[i].machineId].inputs = []
    }

    patches[patchInputs[i].machineId].inputs.push(patchInputs[i])
  }

  console.log("FINAL PATCHES", patches)

  return patches
}
