import { toastMessage } from "../../ui/toast"

export let timeout: NodeJS.Timeout

export const clearActionTimer = () => {
  clearTimeout(timeout)
}

export const startActionTimer = () => {
  timeout = setTimeout(handleQueuedActionTimeout, 15000)
}

export function handleQueuedActionTimeout() {
  toastMessage("Action timed out. Try reloading.", {
    type: "error",
    disappear: false,
  })
}
