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
  },
  machines: any[],
  levels: any[],
  materials: any[],
  commands: any[]
}

// --- STORES -----------------------------------------------------------

export const staticContent = writable({} as StaticContent)

// --- API --------------------------------------------------------------

export async function initStaticContent() {
  const loading = await loadData("*[_type == 'loading'][0]", {})
  const spawning = await loadData("*[_type == 'spawning'][0]", {})
  const levels = await loadData("*[_type == 'level']", {})
  const machines = await loadData("*[_type == 'machine']", {})
  const materials = await loadData("*[_type == 'material']", {})
  const commands = await loadData("*[_type == 'command']", {})
  staticContent.set(
    {
      loading,
      spawning,
      levels,
      machines,
      materials,
      commands
    }
  )
}
