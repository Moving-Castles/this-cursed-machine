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

  const $discoveredMaterials = get(discoveredMaterials)

  // If the discovery is not in there yet
  if (!$discoveredMaterials.includes(discovery.materialId)) {
    discoveries.set([...get(discoveries), discovery])

    // mark as discovered
    discoveredMaterials.set([...$discoveredMaterials, discovery.materialId])
  }
}
