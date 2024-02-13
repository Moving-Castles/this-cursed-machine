import { writable } from 'svelte/store'
import type { SimulatedEntities } from '../../simulated/types'

/**
 * Output of the the network resolver.
 */
export const patches = writable({} as SimulatedEntities)