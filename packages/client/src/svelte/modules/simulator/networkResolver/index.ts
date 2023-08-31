/*
 *  Resolve network
 * 
 */

import { get } from "svelte/store";
import { playerBox } from "../../state";
import { localResolved, patches } from "..";
import { blockNumber } from "../../network";
import { MachineType, MaterialType, PortType } from "../../state/enums";
import { playerCore, machinesInPlayerBox, ports, connections } from "../../state";
import { process } from "./machines";
import type { Product, SimulatedEntities } from "../types";

// --- API -----------------------------------------------------------------

export function initStateSimulator() {

    blockNumber.subscribe(async () => {
        // Player is not spawned yet
        if (!get(playerCore)) return

        // console.log('get(localResolved)', get(localResolved))
        // console.log('get(playerBox).lastResolved', get(playerBox).lastResolved)

        // Network was resolved onchain
        if (get(playerBox).lastResolved !== get(localResolved)) {
            console.log('!!!! Network was resolved onchain')
            // Resolve output
            patches.set(resolve(get(playerCore).carriedBy));
            // Update localResolved
            localResolved.set(get(playerBox).lastResolved)
        }
    });
}

/**
 * Resolves the state of a given box entity.
 * This function simulates a process within a system of machines that interact with each other.
 * It processes the materials through the network of machines until all machines are resolved.
 *
 * @param _boxEntity - Identifier for the box entity to be resolved.
 */
function resolve(_boxEntity: string) {
    // console.log('____ Resolving at block', get(blockNumber));

    let iterationCounter = 0;

    // Get all the machines associated with the box entity.
    const machines = get(machinesInPlayerBox);

    // Array to track which nodes (machines) have been resolved.
    const resolvedNodes: string[] = []

    // Array to hold the inputs
    const inputs: Product[] = []

    let outputs: Product[] = []

    // Loop until all machines are resolved.
    while (resolvedNodes.length < Object.keys(machines).length) {

        // console.log('__ Iteration', iterationCounter)

        // Process each machine.
        Object.entries(machines).forEach(([machineKey, machine]) => {

            // Skip if the machine has already been resolved.
            if (resolvedNodes.includes(machineKey)) return;

            // console.log('** Processing machine_', machineKey, 'type:', machine.machineType)

            // If the machine is an inlet, provide it with pellets as input.
            if (machine.machineType === MachineType.INLET) {
                inputs.push({
                    machineId: machineKey,
                    materialType: MaterialType.PELLET,
                    amount: 100,
                    temperature: 0
                });
            }

            // Gather all the inputs for the current machine.
            const currentInputs = inputs.filter(input => input.machineId === machineKey);

            // Skip if the machine has no inputs.
            if (currentInputs.length === 0) return;

            // console.log('currentInputs', currentInputs)

            // Process the machine's inputs to produce outputs.
            const currentOutputs = process(machine.machineType, currentInputs);

            // Push all products to the output array
            // @todo: refactor
            for (let k = 0; k < currentOutputs.length; k++) {
                if (currentOutputs[k].materialType && currentOutputs[k].materialType !== MaterialType.NONE) {
                    outputs.push(currentOutputs[k]);
                    console.log(currentOutputs[k])
                }
            }

            // Mark the machine as resolved.
            resolvedNodes.push(machineKey);

            // console.log('currentOutputs', currentOutputs)

            // Find the machine's output ports.
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

            // console.log("machinePorts", machinePorts)

            if (machinePorts.length === 0) return;

            // Distribute the machine's outputs to the connected machines.
            for (let k = 0; k < machinePorts.length; k++) {

                // console.log("machinePorts[k]", machinePorts[k])

                const outgoingConnection = Object.values(get(connections)).find(entity => entity.sourcePort === machinePorts[k]) as Connection;

                // console.log("outgoingConnection", outgoingConnection)

                if (!outgoingConnection) continue;

                const inputPort = outgoingConnection.targetPort;
                const targetEntity = get(ports)[inputPort].carriedBy;

                if (currentOutputs[k]?.materialType !== MaterialType.NONE) {
                    const output = currentOutputs[k];
                    output.machineId = targetEntity;
                    inputs.push(output);
                }
            }
        })

        // Increment the counter.
        iterationCounter++;
        // Break out of the loop if it seems like an infinite loop is occurring.
        if (iterationCounter === Object.values(machines).length * 2) break;
    }

    let patches = {} as SimulatedEntities;

    console.log('outputs', outputs);

    // @todo: improve and generalize
    for (let i = 0; i < outputs.length; i++) {
        if (!patches[outputs[i].machineId]) {
            patches[outputs[i].machineId] = {
                intermediaryProducts: []
            }
        }

        if (!patches[outputs[i].machineId].intermediaryProducts) {
            patches[outputs[i].machineId].intermediaryProducts = []
        }

        patches[outputs[i].machineId].intermediaryProducts.push(outputs[i])
    }

    console.log('$$$$$$ patches', patches)

    return patches;
}