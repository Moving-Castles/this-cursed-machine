import { writable } from "svelte/store"
import type { Output } from "@components/Main/Terminal/types"

export const terminalOutput = writable([] as Output[])