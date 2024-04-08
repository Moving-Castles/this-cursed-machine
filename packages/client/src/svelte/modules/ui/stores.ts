import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import { UI, TABS } from "./enums"
import {
  GraphConnection,
  GraphMachine,
} from "@components/Main/Tabs/Pod/Graph/types"

export const UIState = writable(UI.LOADING)
export const activeTab = writable(TABS.POD)

export const localLevel = writable(0)
export const lastCompletedBlock = writable(0)

export const inspecting: Writable<GraphConnection | GraphMachine | null> =
  writable(null)
export const alignTooltip = writable("center") // "center" | "left" | "right" = "center"
export const mouseX = writable(0)
export const mouseY = writable(0)
