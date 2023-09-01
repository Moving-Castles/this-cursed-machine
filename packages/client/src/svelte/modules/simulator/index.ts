/*
 *  Simulates the changing state of the game
 * 
 */
import { writable, derived } from "svelte/store";
import { entities, playerBox } from "../state";
import { blockNumber } from "../network";
import type { SimulatedEntities } from "./types";

// --- STORES -----------------------------------------------------------------

/**
 * Block on which the network was last resolved locally.
 * Used to check against the on-chain lastResolved value.
 */
export const localResolved = writable(0);

/**
 * Current block number - lastResolved
 */
export const blocksSinceLastResolution = derived([blockNumber, playerBox],
    ([$blockNumber, $playerBox]) => {
        return $blockNumber - Number($playerBox.lastResolved);
    }
);

/**
 * Output of the the network resolver.
 */
export const patches = writable({} as SimulatedEntities);

/**
 * On-chain state with the local patches applied each block.
 */
export const simulated = derived([entities, patches, blocksSinceLastResolution], ([$entities, $patches, $blocksSinceLastResolution]) => {

    let simulated: SimulatedEntities = $entities;

    for (const [key, patch] of Object.entries($patches)) {
        // @todo: scaling the products by block since resolution is causing wrong values
        // for (let k = 0; k < simulated[key].intermediaryProducts.length; k++) {
        //     simulated[key].intermediaryProducts[k].amount = patch.intermediaryProducts[k].amount * $blocksSinceLastResolution
        // }
        if (patch.inputs) {
            simulated[key].inputs = patch.inputs;
        }
        if (patch.outputs) {
            simulated[key].outputs = patch.outputs;
        }
    }

    return simulated;
});