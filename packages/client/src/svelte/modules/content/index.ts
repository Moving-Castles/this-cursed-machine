import { writable } from "svelte/store"
import { loadData } from "./sanity"

// --- TYPES ------------------------------------------------------------

export type StaticContent = {
  loading: {
    content: {
      content: any[]
    }
  },
  spawning: {
    content: {
      content: any[]
    }
  }
}

// --- STORES -----------------------------------------------------------

export const staticContent = writable({} as StaticContent)

// --- API --------------------------------------------------------------

export async function initStaticContent() {
  const loading = await loadData("*[_type == 'loading'][0]", {})
  const spawning = await loadData("*[_type == 'spawning'][0]", {})
  staticContent.set(
    {
      loading,
      spawning
    }
  )
}
