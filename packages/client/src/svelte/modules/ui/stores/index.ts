import { writable } from "svelte/store"
import { spring, tweened } from "svelte/motion"

export const delayedWritable = (resetToValue, delay) => {
  const { subscribe, set } = writable(resetToValue)

  return {
    subscribe,
    set: newV => {
      set(newV)
      setTimeout(() => set(resetToValue), delay)
    },
  }
}

/**
 * @param resetToValue
 * @param delay
 */
export const delayedTweened = (resetToValue, delay) => {
  const { subscribe, set } = tweened(resetToValue)

  return {
    subscribe,
    set: newV => {
      set(newV)
      setTimeout(() => set(resetToValue), delay)
    },
  }
}

export enum UI {
  LOADING,
  SPAWNING,
  DEAD,
  READY,
  COMPLETED,
}

export const UIState = writable(UI.LOADING)
export const showFlowChart = writable(false)
export const showGraph = writable(false)
export const showMap = writable(false)
export const showLevelModal = writable(false)
export const localLevel = writable(0)
export const lastCompletedBlock = writable(0)
export const cursorCharacter = writable("")
export const inspecting = writable(null)
export const alignTooltip = writable("center") // "center" | "left" | "right" = "center"
export const graphPulse = writable(0)
export const mouseX = spring(0, { stiffness: 0.6, damping: 0.4 })
export const mouseY = spring(0, { stiffness: 0.6, damping: 0.4 })
