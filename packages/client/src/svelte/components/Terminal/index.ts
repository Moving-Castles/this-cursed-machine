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
  COMMAND.MAP,
  COMMAND.ORDER,
  COMMAND.RESTART,
  COMMAND.COMPLETE,
  COMMAND.FAIL,
  COMMAND.SKIP
]
export const SINGLE_INPUT_COMMANDS = [
  COMMAND.BUILD,
  COMMAND.DESTROY,
  COMMAND.INSPECT,
  COMMAND.CLEAR_STORAGE,
  COMMAND.DISCONNECT_STORAGE
]

export const MULTI_INPUT_COMMANDS = [
  COMMAND.CONNECT,
  COMMAND.DISCONNECT,
  COMMAND.CONNECT_STORAGE
]

export const FULL_COMMANDS = [
  COMMAND.SKIP,
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
  COMMAND.ORDER,
  COMMAND.RESTART,
  COMMAND.COMPLETE,
  COMMAND.FAIL,
  COMMAND.CONNECT_STORAGE,
  COMMAND.DISCONNECT_STORAGE,
  COMMAND.CLEAR_STORAGE
]

// export const COMMANDS_BY_LEVEL: { [level: number]: COMMAND[] } = {
//   0: [
//     COMMAND.HELP,
//     COMMAND.BLINK,
//     COMMAND.SKIP,
//     // ... Hidden
//     COMMAND.RESTART,
//     COMMAND.RESOLVE,
//     COMMAND.TRANSFER,
//     COMMAND.COMPLETE,
//     COMMAND.FAIL
//   ],
//   1: [
//     COMMAND.CONNECT,
//     COMMAND.DISCONNECT,
//     COMMAND.HELP,
//     COMMAND.ORDER,
//     COMMAND.BLINK,
//     COMMAND.MAP,
//     // ... Hidden
//     COMMAND.RESTART,
//     COMMAND.RESOLVE,
//     COMMAND.TRANSFER,
//     COMMAND.COMPLETE,
//     COMMAND.FAIL
//   ],
//   2: [
//     COMMAND.CLEAR,
//     COMMAND.CONNECT,
//     COMMAND.DISCONNECT,
//     COMMAND.HELP,
//     COMMAND.ORDER,
//     COMMAND.BLINK,
//     COMMAND.MAP,
//     // ... Hidden
//     COMMAND.RESTART,
//     COMMAND.RESOLVE,
//     COMMAND.TRANSFER,
//     COMMAND.COMPLETE,
//     COMMAND.FAIL
//   ],
//   3: [
//     COMMAND.CLEAR,
//     COMMAND.CONNECT,
//     COMMAND.DISCONNECT,
//     COMMAND.BUILD,
//     COMMAND.DESTROY,
//     COMMAND.MAP,
//     COMMAND.HELP,
//     COMMAND.ORDER,
//     COMMAND.BLINK,
//     // ... Hidden
//     COMMAND.RESTART,
//     COMMAND.RESOLVE,
//     COMMAND.TRANSFER,
//     COMMAND.COMPLETE,
//     COMMAND.FAIL
//   ],
//   4: [
//     COMMAND.CLEAR,
//     COMMAND.CONNECT,
//     COMMAND.DISCONNECT,
//     COMMAND.BUILD,
//     COMMAND.DESTROY,
//     COMMAND.MAP,
//     COMMAND.HELP,
//     COMMAND.ORDER,
//     COMMAND.BLINK,
//     // ... Hidden
//     COMMAND.RESTART,
//     COMMAND.RESOLVE,
//     COMMAND.TRANSFER,
//     COMMAND.COMPLETE,
//     COMMAND.FAIL
//   ],
//   5: FULL_COMMANDS,
//   6: FULL_COMMANDS,
//   7: FULL_COMMANDS,
//   8: [],
//   9: []
// }

export const COMMANDS_BY_LEVEL: { [level: number]: COMMAND[] } = {
  0: FULL_COMMANDS,
  1: FULL_COMMANDS,
  2: FULL_COMMANDS,
  3: FULL_COMMANDS,
  4: FULL_COMMANDS,
  5: FULL_COMMANDS,
  6: FULL_COMMANDS,
  7: FULL_COMMANDS,
  8: [],
  9: []
}

export const FULL_MACHINES = [
  MachineType.SPLITTER,
  MachineType.MIXER,
  MachineType.DRYER,
  MachineType.WETTER,
  MachineType.BOILER,
  MachineType.COOLER,
]

export const MACHINES_BY_LEVEL: { [level: number]: MachineType[] } = {
  0: FULL_MACHINES,
  1: FULL_MACHINES,
  2: FULL_MACHINES,
  3: FULL_MACHINES,
  4: FULL_MACHINES,
  5: FULL_MACHINES,
  6: FULL_MACHINES,
  7: FULL_MACHINES,
  8: [],
  9: []
}

// export const MACHINES_BY_LEVEL: { [level: number]: MachineType[] } = {
//   0: [],
//   1: [],
//   2: [],
//   3: [
//     MachineType.MIXER,
//     MachineType.COOLER,
//   ],
//   4: [
//     MachineType.MIXER,
//     MachineType.COOLER,
//     MachineType.SPLITTER,
//     MachineType.BOILER,
//   ],
//   5: FULL_MACHINES,
//   6: FULL_MACHINES,
//   7: FULL_MACHINES,
//   8: [],
//   9: []
// }

export const FIXED_MACHINE_TYPES = [MachineType.PLAYER, MachineType.INLET, MachineType.OUTLET]
export const BETWEEN_SQUARE_BRACKETS = /(?<=\[).+?(?=\])/g
export const BETWEEN_BRACKETS = /(?<=\().+?(?=\))/g
export const BETWEEN_CARETS = /(?<=\>).+?(?=\<)/g
