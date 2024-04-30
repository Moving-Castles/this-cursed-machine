import { toastMessage } from "../../ui/toast"

export let timeout: number

export const clearActionTimer = () => {
  clearTimeout(timeout)
}

export const startActionTimer = () => {
  timeout = window.setTimeout(handleQueuedActionTimeout, 30000)
}

export function handleQueuedActionTimeout() {
  toastMessage("Action timed out. Try reloading.", {
    type: "error",
    disappear: true,
  })
}
