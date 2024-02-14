import { derived } from "svelte/store"
import { EMPTY_CONNECTION, capAtZero, deepClone } from "../../utils"
import { MACHINE_TYPE, MATERIAL_TYPE } from "../base/enums"
import type { SimulatedEntities, SimulatedDepots, SimulatedMachines, Connection } from "./types"
import { machines, depots, playerPod } from "../base/stores"
import { patches } from "../resolver/patches/stores"
import { blocksSinceLastResolution } from "../resolver/stores"

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

export function calculateSimulatedDepots(depots: Depots, patches: SimulatedEntities, blocksSinceLastResolution: number, playerPod: Pod): SimulatedDepots {
    // Create deep copy to avoid accidentally mutating the original object.
    const initialDepotsCopy = deepClone(depots);
    const patchesCopy = deepClone(patches);
    const playerPodCopy = deepClone(playerPod)

    // Get depot that is connected to the inlet of the player pod
    // TODO: this, and many other things, needs to be reworked to support multiple inlets
    const inletDepot = Object.values(initialDepotsCopy).find(depot => depot.depotConnection === playerPodCopy.fixedEntities.inlets[0])

    let simulatedDepots: SimulatedDepots = Object.fromEntries([...Object.entries(initialDepotsCopy)])

    const filteredPatches = Object.entries(patchesCopy).filter(([_, patch]) => patch.depot)

    // Iterate over each patch in the patches store.
    for (const [key, patch] of filteredPatches) {

        if (!patch.depot || !simulatedDepots[key]) continue

        // Depot connected to inlet
        if (Array.isArray(patch.outputs) && patch.outputs[0]) {
            const patchOutput = patch.outputs[0]
            // Subtract from depot, capping at zero
            const cappedAmount = capAtZero(initialDepotsCopy[key].amount - (patchOutput.amount * blocksSinceLastResolution))
            simulatedDepots[key].amount = cappedAmount
            // If the amount is zero, set the material type to none
            simulatedDepots[key].materialType = cappedAmount === 0 ? MATERIAL_TYPE.NONE : patchOutput.materialType
        }

        // Depot connected to outlet
        if (Array.isArray(patch.inputs) && patch.inputs[0]) {
            const patchInput = patch.inputs[0]
            // If the current material is the same, add to it
            if (initialDepotsCopy[key].materialType === patchInput.materialType) {
                const outputAmount = patchInput.amount * blocksSinceLastResolution
                simulatedDepots[key].amount = (initialDepotsCopy[key].amount ?? 0) + capByInputDepotAmount(outputAmount, patchInput.divisor, inletDepot?.amount ?? 0)
            } else {
                // Otherwise, we replace it
                simulatedDepots[key].materialType = patchInput.materialType
                const outputAmount = patchInput.amount * blocksSinceLastResolution
                simulatedDepots[key].amount = capByInputDepotAmount(outputAmount, patchInput.divisor, inletDepot?.amount ?? 0)
            }
        }
    }

    // Return the updated simulated state.
    return simulatedDepots
}

function capByInputDepotAmount(amount: number, divisor: number, inputDepotAmount: number): number {
    // The divisor is the loss caused by the transformations 
    const outputAmountExceededInput = amount >= inputDepotAmount / (divisor == 0 ? 1 : divisor)
    const cappedAmount = outputAmountExceededInput ? inputDepotAmount / divisor : amount
    return cappedAmount
}

export function calculateSimulatedConnections(simulatedMachines: SimulatedEntities): Connection[] {
    let connections: Connection[] = []
    const simulatedMachinesCopy = deepClone(simulatedMachines)

    Object.entries(simulatedMachinesCopy).forEach(([sourceAddress, machine]) => {
        machine.outgoingConnections?.forEach((targetAddress, i) => {
            if (targetAddress === EMPTY_CONNECTION) return
            const sourceMachine = simulatedMachinesCopy[sourceAddress]
            const product = sourceMachine?.outputs
                ? sourceMachine?.outputs[i]
                : null
            connections.push({
                id: `${sourceAddress}-${targetAddress}-${i}`,
                sourceMachine: sourceAddress,
                targetMachine: targetAddress,
                portIndex: i,
                product: product,
            })
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
// We re-calculate every based on the blocks passed since the last resolution
export const simulatedDepots = derived(
    [depots, patches, blocksSinceLastResolution, playerPod],
    ([$depots, $patches, $blocksSinceLastResolution, $playerPod]) => calculateSimulatedDepots($depots, $patches, $blocksSinceLastResolution, $playerPod)
)

// Cconnection objects based on the properties of the machines
export const simulatedConnections = derived(simulatedMachines, $simulatedMachines => calculateSimulatedConnections($simulatedMachines))

export const readableMachines = derived(simulatedMachines, $simulatedMachines => getReadableMachines($simulatedMachines))
