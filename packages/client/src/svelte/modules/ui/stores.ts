import { writable } from "svelte/store"
import { spring } from "svelte/motion"
import { UI, TABS } from "./enums"

export const UIState = writable(UI.LOADING)
export const activeTab = writable(TABS.POD)

export const localLevel = writable(0)
export const lastCompletedBlock = writable(0)

export const cursorCharacter = writable("")
export const inspecting = writable(null)
export const alignTooltip = writable("center") // "center" | "left" | "right" = "center"
export const mouseX = spring(0, { stiffness: 0.6, damping: 0.4 })
export const mouseY = spring(0, { stiffness: 0.6, damping: 0.4 })