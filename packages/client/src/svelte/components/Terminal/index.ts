import { writable } from "svelte/store"
import type { Output } from "./types"
import { COMMAND } from "./types"
import { MachineType } from "../../modules/state/enums"

// STORES
export const terminalIndex = writable(-1)
export const terminalOutput = writable([] as Output[])

// CONSTANTS
export const SYMBOLS = [
  "›",
  "»",
  "*",
  "+",
  "‡",
  "†",
  "+",
  "◊",
  "”",
  "%",
  "#",
  "«",
  "¥",
  "?",
  "»"
]
export const NO_INPUT_COMMANDS = [
  COMMAND.BLINK,
  COMMAND.CLEAR,
  COMMAND.HELP,
  COMMAND.RESOLVE,
  COMMAND.TRANSFER,
]
export const SINGLE_INPUT_COMMANDS = [
  COMMAND.BUILD,
  COMMAND.DESTROY,
  COMMAND.DISCONNECT,
  COMMAND.INSPECT
]
export const SPAWN_COMMANDS = [
  COMMAND.HELP,
  COMMAND.BLINK
]
export const FIXED_MACHINE_TYPES = [MachineType.CORE, MachineType.INLET, MachineType.OUTLET]
export const BETWEEN_SQUARE_BRACKETS = /(?<=\[).+?(?=\])/g
export const BETWEEN_BRACKETS = /(?<=\().+?(?=\))/g
export const BETWEEN_CARETS = /(?<=\>).+?(?=\<)/g
