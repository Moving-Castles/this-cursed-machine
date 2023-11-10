import { derived } from "svelte/store"
import { WAREHOUSE_ID, cores, materials } from "../../modules/state"

const COMPLETED_LEVEL = 9

/**
 * Completed cores
 */
export const completedCores = derived(cores, $cores => {
    return Object.fromEntries(
        Object.entries($cores).filter(
            ([, core]) => core.level === COMPLETED_LEVEL
        )
    ) as Cores
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