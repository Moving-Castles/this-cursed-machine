import { writable } from "svelte/store"
import { storableNumber } from "@modules/utils/storable"
import type { Writable } from "svelte/store"
import { spring } from "svelte/motion"
import { UI, TABS } from "./enums"
import { GraphConnection, GraphMachine } from "@svelte/components/Main/Tabs/Pod/Graph/types"

export const UIState = writable(UI.LOADING)
export const activeTab = storableNumber(TABS.POD, "tab")

export const localLevel = writable(0)
export const lastCompletedBlock = writable(0)

export const cursorCharacter = writable("")
export const inspecting: Writable<GraphConnection | GraphMachine | null> = writable(null)
export const alignTooltip = writable("center") // "center" | "left" | "right" = "center"
export const mouseX = spring(0, { stiffness: 0.6, damping: 0.4 })
export const mouseY = spring(0, { stiffness: 0.6, damping: 0.4 })
