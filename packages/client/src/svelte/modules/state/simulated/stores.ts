import { derived } from "svelte/store"
import { deepClone } from "@modules/utils/"
import { EMPTY_CONNECTION } from "@modules/utils/constants"
import { MACHINE_TYPE, MATERIAL_TYPE } from "@modules/state/base/enums"
import type { SimulatedEntities, SimulatedEntity, SimulatedDepots, SimulatedMachines, Connection } from "./types"
import { machines, depots, playerPod } from "@modules/state/base/stores"
import { patches } from "@modules/state/resolver/patches/stores"
import { blocksSinceLastResolution } from "@modules/state/resolver/stores"

export function processPatches(field: "inputs" | "outputs", simulated: SimulatedEntities, key: string, patch: any): SimulatedMachines {
    // Early return if conditions are not met, without modifying the original 'simulated' object.
    if (!patch[field] || !simulated[key]) return simulated as SimulatedMachines;

    // Create a deep copy of 'simulated' to avoid mutating the original object.
    const simulatedCopy = deepClone(simulated) as SimulatedMachines;

    // Assign the inputs/outputs from the patch to a new copy of the entity in the simulated state.
    const updatedEntity = { ...simulatedCopy[key], [field]: [...patch[field]] };

    // Update the entity in the simulated copy with the new changes.
    simulatedCopy[key] = updatedEntity;

    // Return the updated copy of 'simulated'.
    return simulatedCopy;
}

export function applyPatches(machines: Machines, patches: SimulatedEntities): SimulatedMachines {
    // Create deep copy to avoid accidentally mutating the original object.
    const patchesCopy = deepClone(patches);
    const machinesCopy = deepClone(machines);

    let simulatedMachines: SimulatedMachines = Object.fromEntries([...Object.entries(machinesCopy)])

    const filteredPatches = Object.entries(patchesCopy).filter(([_, patch]) => !patch.depot)

    // Iterate over each patch in the patches store.
    for (const [key, patch] of filteredPatches) {
        simulatedMachines = processPatches("inputs", simulatedMachines, key, patch);
        simulatedMachines = processPatches("outputs", simulatedMachines, key, patch);
    }

    // Return the updated simulated state.
    return simulatedMachines
}

/*
* Should work the same as contracts/src/libraries/LibDepot.sol:write
*/
export function calculateSimulatedDepots(depots: Depots, patches: SimulatedEntities, blocksSinceLastResolution: number, playerPod: Pod): SimulatedDepots {

    const FLOW_RATE = 1000;

    // Create deep copy to avoid accidentally mutating the original object.
    const initialDepotsCopy = deepClone(depots);
    const patchesCopy = deepClone(patches);
    const playerPodCopy = deepClone(playerPod)

    let simulatedDepots: SimulatedDepots = Object.fromEntries([...Object.entries(initialDepotsCopy)])

    const inletDepots = Object.entries(initialDepotsCopy).filter(([_, depot]) => playerPodCopy.fixedEntities.inlets.includes(depot.depotConnection))
    const depotPatches = Object.entries(patchesCopy).filter(([_, patch]) => patch.depot)

    /*
     * Filter out the inlet depots that are not contributing to the output
     */
    const usedInletDepots = getUsedInletDepots(inletDepots, playerPodCopy.fixedEntities.inlets, depotPatches);
    const usedInletDepotsKeys = usedInletDepots.map(([key, _]) => key)


    const lowestInputAmount = findLowestValue(usedInletDepots);
    if (lowestInputAmount === 0) return simulatedDepots;

    /*
     * With a flow rate of FLOW_RATE per block,
     * how long does it take for the lowest input to be exhausted?
     */
    const exhaustionBlock = lowestInputAmount / FLOW_RATE;

    /*
     * if exhaustionBlock > _blocksSinceLastResolution => capped output amount is blocks since last resolution
     * if exhaustionBlock < _blocksSinceLastResolution => capped output amount is equal to exhaustionBlock
     */
    const cappedBlocks = exhaustionBlock > blocksSinceLastResolution
        ? blocksSinceLastResolution
        : exhaustionBlock;

    for (const [key, patch] of depotPatches) {

        if (!simulatedDepots[key]) continue

        /*
         * Write to outlet depot
         * Add if material is same, otherwise replace
         */
        if (Array.isArray(patch.inputs) && patch.inputs[0]) {
            const patchInput = patch.inputs[0]
            const cumulativeOutputAmount = patchInput.amount * cappedBlocks;
            if (initialDepotsCopy[key].materialType === patchInput.materialType) {
                simulatedDepots[key].amount = (initialDepotsCopy[key].amount ?? 0) + cumulativeOutputAmount
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
        if (Array.isArray(patch.outputs) && patch.outputs[0] && usedInletDepotsKeys.includes(key)) {
            const consumedInletAmount = cappedBlocks * FLOW_RATE;
            if (consumedInletAmount === initialDepotsCopy[key].amount) {
                simulatedDepots[key].materialType = MATERIAL_TYPE.NONE
                simulatedDepots[key].amount = 0
            } else {
                simulatedDepots[key].amount = initialDepotsCopy[key].amount - consumedInletAmount
            }
        }

    }

    // Return the updated simulated state.
    return simulatedDepots
}

function findLowestValue(usedInletDepots: [string, Depot][]): number {
    let lowestEntry: [string, Depot] | null = null;

    for (const [key, depot] of usedInletDepots) {
        if (!lowestEntry || depot.amount < lowestEntry[1].amount) {
            lowestEntry = [key, depot];
        }
    }

    if (!lowestEntry) return 0;

    return lowestEntry[1].amount ?? 0;
}

function getUsedInletDepots(inletDepots: [string, Depot][], inlets: string[], depotPatches: [string, SimulatedEntity][]): [string, Depot][] {
    let inletActive: boolean[] | null = null;
    let usedInletDepots: [string, Depot][] = []

    // Find the outlet patch – it is the only one with inputs
    for (const [, patch] of depotPatches) {
        if (Array.isArray(patch.inputs) && patch.inputs[0]) {
            // Get the boolean array indicating which of the inlets contributed to the final output
            inletActive = patch.inputs[0].inletActive;
            break;
        }
    }

    if (inletActive == null) return usedInletDepots;

    // Iterate over the inlet depots and check if the inlet it is connected is active
    for (let i = 0; i < inletDepots.length; i++) {

        const inletIndex = inlets.indexOf(inletDepots[i][1].depotConnection);

        if (inletActive[inletIndex]) {
            usedInletDepots.push(inletDepots[i]);
        }
    }

    return usedInletDepots;
}

export function calculateSimulatedConnections(simulatedMachines: SimulatedMachines): Connection[] {
    let connections: Connection[] = []
    const simulatedMachinesCopy = deepClone(simulatedMachines)

    Object.entries(simulatedMachinesCopy).forEach(([sourceAddress, machine]) => {

        machine.outgoingConnections.forEach((targetAddress, i) => {

            if (targetAddress === EMPTY_CONNECTION) return

            const sourceMachine = simulatedMachinesCopy[sourceAddress]
            const targetMachine = simulatedMachinesCopy[targetAddress]

            const targetPortIndex = targetMachine.incomingConnections.findIndex(connection => connection === sourceAddress)

            if (!sourceMachine) return

            let connection: Connection = {
                id: `FROM-${sourceAddress}-TO-${targetAddress}-${i}`,
                sourceMachine: sourceAddress,
                targetMachine: targetAddress,
                portIndex: {
                    source: i,
                    target: targetPortIndex
                }
            }

            const product = sourceMachine.outputs
                ? sourceMachine?.outputs[i]
                : null

            if (product) {
                connection.product = product
            }

            connections.push(connection)
        })
    })

    return connections
}

export function getReadableMachines(simulatedMachines: SimulatedEntities) {
    return Object.entries(simulatedMachines).map(([id, machine]) => ({
        id,
        machine,
        read: MACHINE_TYPE[machine.machineType ?? MACHINE_TYPE.NONE],
    }))
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
    ([$depots, $patches, $blocksSinceLastResolution, $playerPod]) => calculateSimulatedDepots($depots, $patches, $blocksSinceLastResolution, $playerPod)
)

// Connection objects based on the properties of the machines
export const simulatedConnections = derived(simulatedMachines, $simulatedMachines => calculateSimulatedConnections($simulatedMachines))

export const readableMachines = derived(simulatedMachines, $simulatedMachines => getReadableMachines($simulatedMachines))
