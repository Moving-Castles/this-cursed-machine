import type { Product } from './types';
import type { SimulatedEntities } from '../../simulated/types';
import { deepClone } from '@svelte/modules/utils';

export function organizePatches(
    dataArray: any[],
    key: string,
    field: string
): SimulatedEntities {
    // Create a new object to avoid modifying the original patches
    const newPatches = {} as SimulatedEntities;

    for (let i = 0; i < dataArray.length; i++) {
        const itemKey = dataArray[i][key];

        // Skip if key is empty
        if (!itemKey) continue

        // Initialize the key object if it doesn't exist
        if (!newPatches[itemKey]) {
            newPatches[itemKey] = { [field]: [] };
        }

        // Ensure the field array exists
        if (!newPatches[itemKey][field]) {
            newPatches[itemKey][field] = [];
        }

        // Push the current item to the field array
        newPatches[itemKey][field].push(dataArray[i]);
    }

    return newPatches;
}

export function consolidatePatches(patches: SimulatedEntities[]): SimulatedEntities {
    const newPatches = {} as SimulatedEntities;

    for (let i = 0; i < patches.length; i++) {
        for (const key in patches[i]) {
            if (!newPatches[key]) {
                newPatches[key] = {};
            }

            for (const field in patches[i][key]) {
                if (!newPatches[key][field]) {
                    newPatches[key][field] = [];
                }

                if (Array.isArray(patches[i][key][field])) {
                    newPatches[key][field].push(...patches[i][key][field]);
                } else {
                    newPatches[key][field] = patches[i][key][field];
                }
            }
        }
    }

    return newPatches;
}

export function createOutletDepotPatches(
    circuitClosed: Boolean,
    outputPatches: Product[],
    outlet: string,
    outletDepot: string | null
): SimulatedEntities {
    const newPatches = {} as SimulatedEntities;

    // Abort if circuit is not closed
    if (!circuitClosed) return newPatches;

    // Abort if no connected depot
    if (!outletDepot) return newPatches;

    // Get the output from the outlet
    const outletOutput = outputPatches.filter(patch => patch.machineId === outlet);

    if (outletOutput[0]) {
        // Create patch for depot
        newPatches[outletDepot] = {
            depot: true,
            inputs: [{
                machineId: outletDepot,
                sourceMachineId: outletOutput[0].machineId,
                materialType: outletOutput[0].materialType,
                amount: outletOutput[0].amount,
                inletActive: outletOutput[0].inletActive,
            }]
        }
    }

    return newPatches;
}

export function createInletDepotPatches(
    circuitClosed: Boolean,
    inputPatches: Product[],
    inlets: string[],
    machines: Machines
): SimulatedEntities {
    const newPatches = {} as SimulatedEntities;

    // Abort if circuit is not closed
    if (!circuitClosed) return newPatches;

    // Get the inputs from to the inlets
    const inletInputs = inputPatches.filter(patch => inlets.includes(patch.machineId));

    for (let i = 0; i < inletInputs.length; i++) {

        const depotId = machines[inletInputs[i].machineId]?.depotConnection;

        if (!depotId) continue;

        // Create patch for depot
        newPatches[depotId] = {
            depot: true,
            outputs: [{
                machineId: depotId,
                sourceMachineId: null,
                materialType: inletInputs[i].materialType,
                amount: inletInputs[i].amount,
                inletActive: inletInputs[i].inletActive
            }]
        }
    }

    return newPatches;
}

export function backtraceOutletConnection(simulatedEntities: SimulatedEntities, outlet: string): SimulatedEntities {
    // Deep clone to avoid mutating the input object
    const simulatedEntitiesCopy = deepClone(simulatedEntities);

    // Recursive function to mark entities as productive by tracing back their source
    const markProductive = (machineId: string): void => {
        const machine = simulatedEntitiesCopy[machineId];
        if (!machine || machine.productive) return;

        machine.productive = true;

        machine.inputs?.forEach(input => {
            if (input.sourceMachineId) {
                markProductive(input.sourceMachineId); // Recursively mark the source entity as productive
            }
        });
    };

    // Starting entity for backtracing
    const outletEntity: Entity | undefined = simulatedEntitiesCopy[outlet];
    if (!outletEntity || !outletEntity.inputs || !outletEntity.inputs[0]) return simulatedEntitiesCopy;

    // Initiate the recursive backtracing from the outlet entity
    markProductive(outlet);

    return simulatedEntitiesCopy;
}