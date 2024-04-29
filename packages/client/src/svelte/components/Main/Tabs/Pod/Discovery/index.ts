import type { Writable } from "svelte/store"
import { writable, get } from "svelte/store"
import { discoveredMaterials } from "@modules/state/simulated/stores"

export type Discovery = MaterialMetadata & {
  timestamp: number
}

export const discoveries: Writable<Discovery[]> = writable([])

export function discover(material: MaterialMetadata) {
  const discovery: Discovery = {
    ...material,
    timestamp: performance.now(),
  }
  discoveries.set([...get(discoveries), discovery])
  // mark as discovered
  discoveredMaterials.set([...get(discoveredMaterials), discovery.materialId])
}
