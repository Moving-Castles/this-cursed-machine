import { writable } from "svelte/store"
import type { Output } from "./types"
import { COMMAND } from "./types"
import { MachineType } from "../../modules/state/enums"

// STORES
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
  COMMAND.BLINK,
  COMMAND.SKIP
]

export const FULL_COMMANDS = [
  COMMAND.BLINK,
  COMMAND.CLEAR,
  COMMAND.HELP,
  COMMAND.BUILD,
  COMMAND.DESTROY,
  COMMAND.CONNECT,
  COMMAND.DISCONNECT,
  COMMAND.INSPECT,
  COMMAND.RESOLVE,
  COMMAND.TRANSFER,
  COMMAND.MAP,
  COMMAND.GOALS,
  COMMAND.RESTART
]

export const COMMANDS_BY_LEVEL: { [level: number]: COMMAND[] } = {
  0: [
    COMMAND.HELP,
    COMMAND.BLINK,
    COMMAND.SKIP,
    COMMAND.RESTART
  ],
  1: [
    COMMAND.CONNECT,
    COMMAND.DISCONNECT,
    COMMAND.HELP,
    COMMAND.GOALS,
    COMMAND.BLINK,
    COMMAND.RESTART
  ],
  2: [
    COMMAND.CONNECT,
    COMMAND.DISCONNECT,
    COMMAND.HELP,
    COMMAND.GOALS,
    COMMAND.BLINK,
    COMMAND.RESTART
  ],
  3: [
    COMMAND.CONNECT,
    COMMAND.DISCONNECT,
    COMMAND.BUILD,
    COMMAND.DESTROY,
    COMMAND.HELP,
    COMMAND.GOALS,
    COMMAND.BLINK,
    COMMAND.RESTART
  ],
  4: [
    COMMAND.CONNECT,
    COMMAND.DISCONNECT,
    COMMAND.BUILD,
    COMMAND.DESTROY,
    COMMAND.MAP,
    COMMAND.HELP,
    COMMAND.GOALS,
    COMMAND.BLINK,
  ],
  5: FULL_COMMANDS,
  6: FULL_COMMANDS,
  7: FULL_COMMANDS,
}

export const FULL_MACHINES = [
  MachineType.INLET,
  MachineType.OUTLET,
  MachineType.CORE,
  MachineType.SPLITTER,
  MachineType.MIXER,
  MachineType.DRYER,
  MachineType.WETTER,
  MachineType.BOILER,
  MachineType.COOLER,
]

export const MACHINES_BY_LEVEL: { [level: number]: MachineType[] } = {
  0: [],
  1: [],
  2: [],
  3: [
    MachineType.MIXER,
    MachineType.COOLER,
  ],
  4: [
    MachineType.MIXER,
    MachineType.COOLER,
    MachineType.SPLITTER,
    MachineType.BOILER,
  ],
  5: FULL_MACHINES,
  6: FULL_MACHINES,
  7: FULL_MACHINES,
}


export const FIXED_MACHINE_TYPES = [MachineType.CORE, MachineType.INLET, MachineType.OUTLET]
export const BETWEEN_SQUARE_BRACKETS = /(?<=\[).+?(?=\])/g
export const BETWEEN_BRACKETS = /(?<=\().+?(?=\))/g
export const BETWEEN_CARETS = /(?<=\>).+?(?=\<)/g
