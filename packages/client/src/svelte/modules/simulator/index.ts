/*
 *  Simulates the changing state of the game
 * 
 */
import { writable, derived } from "svelte/store";
import { MachineType, MaterialType } from "../state/enums";
import { playerBox } from "../state";
import { blockNumber } from "../network";

// --- TYPES -----------------------------------------------------------------

export type Product = {
    machineId: string;
    materialType: MaterialType;
    amount: number;
    temperature: number;
}

export type SimulatedEntity = {
    machineType?: MachineType,
    active?: boolean,
    output: Product[],
}

export type SimulatedEntities = {
    [key: string]: SimulatedEntity
}

// --- STORES -----------------------------------------------------------------

export const localResolved = writable(0);

export const blocksSinceLastResolution = derived([blockNumber, playerBox],
    ([$blockNumber, $playerBox]) => {
        return $blockNumber - Number($playerBox.lastResolved);
    }
);

export const currentOutput = writable([] as Product[]);

export const simulatedState = derived([currentOutput, blocksSinceLastResolution], ([$currentOutput, $blocksSinceLastResolution]) => {
    const simulatedState: Product[] = []

    for (const product of $currentOutput) {
        const simulatedProduct = { ...product };
        simulatedProduct.amount = product.amount * $blocksSinceLastResolution;
        simulatedState.push(simulatedProduct);
    }

    return simulatedState;
});

// --- API -----------------------------------------------------------------

/**
 * Updates the simulated state to add output for a given product.
 * Consolidates the output based on machineId and materialType.
 *
 * @param {Product} product - The product to be added to the machine's output.
 */
// export function addOutput(product: Product) {
//     // Update the simulatedState using its update method
//     simulatedState.update((state) => {
//         // If the machineId does not yet exist in the state, initialize it with an empty output array
//         if (!state[product.machineId]) state[product.machineId] = { output: [] };

//         // Consolidate the existing output array with the new product
//         state[product.machineId].output = consolidate([...state[product.machineId].output, product]);

//         // Return the updated state
//         return state;
//     });
// }

// --- UTILS -----------------------------------------------------------------

/**
 * Consolidates the list of products based on machineId and materialType.
 * Sums up amounts and averages temperatures for the same machineId and materialType combination.
 *
 * @param {Product[]} entries - Array of products to consolidate.
 * @returns {Product[]} - Consolidated list of products.
 */
// function consolidate(entries: Product[]): Product[] {
//     // An object to hold the consolidated data with a combination key of machineId and materialType
//     const consolidated: { [key: string]: { totalAmount: number, totalTemperature: number, count: number } } = {};

//     // Loop through each product entry to consolidate
//     for (const entry of entries) {
//         const { machineId, materialType, amount, temperature } = entry;

//         // Generate a unique key based on machineId and materialType
//         const key = `${machineId}_${materialType}`;

//         // If this unique key doesn't exist yet in consolidated, initialize it
//         if (!consolidated[key]) {
//             consolidated[key] = { totalAmount: 0, totalTemperature: 0, count: 0 };
//         }

//         // Add up the amounts, temperatures, and increment the count for this key
//         consolidated[key].totalAmount += amount;
//         consolidated[key].totalTemperature += temperature;
//         consolidated[key].count += 1;
//     }

//     const result: Product[] = [];

//     // Build the result array based on the consolidated data
//     for (const key in consolidated) {
//         const [machineId, materialTypeStr] = key.split('_');
//         const materialType = +materialTypeStr; // Convert the materialType string back to a number

//         result.push({
//             machineId,
//             materialType,
//             amount: consolidated[key].totalAmount,
//             temperature: consolidated[key].totalTemperature / consolidated[key].count
//         });
//     }

//     return result;
// }
