import { writable } from "svelte/store"
import { loadData } from "./sanity"

// --- TYPES ------------------------------------------------------------

export type StaticContent = {
  loading: {
    content: {
      content: any[]
    }
  }
  machines: any[]
  materials: any[]
  tutorial: any
  messages: any[]
}

// --- STORES -----------------------------------------------------------

export const staticContent = writable({} as StaticContent)

// --- API --------------------------------------------------------------

export async function initStaticContent() {
  const loading = await loadData("*[_type == 'loading'][0]", {})
  const machines = await loadData("*[_type == 'machine']", {})
  const materials = await loadData("*[_type == 'material']{..., hint->}", {})
  const tutorial = await loadData("*[_type == 'tutorial'][0]", {})
  const messages = await loadData("*[_type == 'message']", {})
  staticContent.set({
    loading,
    machines,
    materials,
    tutorial,
    messages,
  })
}
