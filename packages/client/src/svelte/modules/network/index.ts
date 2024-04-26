import { writable } from "svelte/store";
import { SetupPublicNetworkResult } from "@mud/setupPublicNetwork";
import { SetupWalletNetworkResult } from "@mud/setupWalletNetwork";

// ----------------------------------------------------------------------------

export { initBlockListener } from "./blockListener";

// --- STORES -----------------------------------------------------------------

export const publicNetwork = writable({} as SetupPublicNetworkResult);
export const walletNetwork = writable({} as SetupWalletNetworkResult);
export const blockNumber = writable(0);
export const ready = writable(false);
export const loadingMessage = writable("Loading");
