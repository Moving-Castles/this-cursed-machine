import { toastMessage } from "../../ui/toast"
import { watchingAction } from "../actionSequencer"

let activeActionsTimeout: NodeJS.Timeout

export function setActionTimeout(timeout: number) {
  activeActionsTimeout = setTimeout(handleQueuedActionTimeout, timeout)
}

export function clearActionTimeout() {
  console.log("clear", activeActionsTimeout)
  clearTimeout(activeActionsTimeout)
}

function handleQueuedActionTimeout() {
  toastMessage("Action timed out. Try reloading.", {
    type: "error",
    disappear: false,
  })
  watchingAction.set(null)
}
