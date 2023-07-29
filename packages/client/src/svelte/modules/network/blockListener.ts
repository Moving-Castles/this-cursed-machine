import { get } from "svelte/store";
import { network, blockNumber } from "./index";
import { toastMessage } from "../ui/toast"

let blockTimeout: NodeJS.Timeout;
const TIMEOUT = 10000;

export function initBlockListener() {
    get(network).network.blockNumber$.subscribe((x: number) => {
        // Show a error message if we haven't received a block in a while
        clearTimeout(blockTimeout);
        blockTimeout = setTimeout(handleBlockTimeout, TIMEOUT);
        // For convenience, we store the block number in a svelte store
        blockNumber.set(x)
    })
}

function handleBlockTimeout() {
    toastMessage("Connection to chain lost. Try reloading.", { type: "error", disappear: false });
}