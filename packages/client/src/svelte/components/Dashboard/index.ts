import { derived } from "svelte/store"
import { WAREHOUSE_ID, players, materials } from "../../modules/state"

const COMPLETED_LEVEL = 9

/**
 * Completed players
 */
export const completedplayers = derived(players, $players => {
    return Object.fromEntries(
        Object.entries($players).filter(
            ([, player]) => player.level === COMPLETED_LEVEL
        )
    ) as Players
})

/**
 * Warehouse materials
 */
export const warehouseMaterials = derived(materials, $materials => {
    return Object.fromEntries(
        Object.entries($materials).filter(
            ([, material]) => material.carriedBy === WAREHOUSE_ID
        )
    ) as Materials
})