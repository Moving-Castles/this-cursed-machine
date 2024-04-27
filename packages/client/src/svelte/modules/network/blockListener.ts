import { get } from "svelte/store"
import { publicNetwork, blockNumber } from "./index"
import { toastMessage } from "../ui/toast"

let blockTimeout: number
const TIMEOUT = 10000

export function initBlockListener() {
  get(publicNetwork).latestBlock$.subscribe(block => {
    // Show a error message if we haven't received a block in a while
    clearTimeout(blockTimeout)
    blockTimeout = window.setTimeout(handleBlockTimeout, TIMEOUT)
    // For convenience, we store the block number in a svelte store
    blockNumber.set(block.number ?? BigInt(0))
  })
}

function handleBlockTimeout() {
  toastMessage("Connection to chain lost. Try reloading.", {
    type: "error",
    disappear: true,
  })
}
