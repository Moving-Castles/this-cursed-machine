import { toastMessage } from "../../ui/toast"

let activeActionsTimeout: NodeJS.Timeout;

export function setActionTimeout(timeout: number) {
    activeActionsTimeout = setTimeout(handleQueuedActionTimeout, timeout);
}

export function clearActionTimeout() {
    clearTimeout(activeActionsTimeout);
}

function handleQueuedActionTimeout() {
    toastMessage("Action timed out. Try reloading.", { type: "error", disappear: false });
}
