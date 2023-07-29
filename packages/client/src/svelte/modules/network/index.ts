import { writable } from "svelte/store";
import type { SetupResult } from "../../../mud/setup"

// ----------------------------------------------------------------------------

export { initBlockListener } from "./blockListener";

// --- STORES -----------------------------------------------------------------

export const network = writable({} as SetupResult);
export const blockNumber = writable(0);
export const ready = writable(false);
export const loadingMessage = writable("Loading");

