import { writable, get } from "svelte/store"
import { toastMessage } from "../../ui/toast"
import { watchingAction } from "../actionSequencer"

export const timeout = writable(null as ReturnType<typeof setTimeout> | null)

export const clear = () => clearTimeout(get(timeout))
export const start = () =>
  timeout.set(setTimeout(handleQueuedActionTimeout, 15000))

export function handleQueuedActionTimeout() {
  toastMessage("Action timed out. Try reloading.", {
    type: "error",
    disappear: false,
  })
  watchingAction.set(null)
}
