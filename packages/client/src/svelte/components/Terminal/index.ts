import { writable } from "svelte/store"
import type { Output } from "./types"
import { COMMAND } from "./types"
import { MACHINE_TYPE } from "../../modules/state/enums"

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
  COMMAND.START,
  COMMAND.COMPLETE,
  COMMAND.FAIL,
  COMMAND.ATTACH_DEPOT,
  COMMAND.DETACH_DEPOT,
  COMMAND.CLEAR_DEPOT,
  COMMAND.FILL,
  COMMAND.ACCEPT,
  COMMAND.BUY,
  COMMAND.GRADUATE
]

export const NO_INPUT_COMMANDS = [
  COMMAND.BLINK,
  COMMAND.CLEAR,
  COMMAND.HELP,
  COMMAND.RESOLVE,
  COMMAND.TRANSFER,
  COMMAND.MAP,
  COMMAND.ORDER,
  COMMAND.START,
  COMMAND.COMPLETE,
  COMMAND.FAIL,
  COMMAND.SKIP,
  COMMAND.BUY,
  COMMAND.GRADUATE
]

export const SINGLE_INPUT_COMMANDS = [
  COMMAND.BUILD,
  COMMAND.DESTROY,
  COMMAND.INSPECT,
  COMMAND.CLEAR_DEPOT,
  COMMAND.DETACH_DEPOT,
  COMMAND.FILL,
  COMMAND.ACCEPT,
]

export const MULTI_INPUT_COMMANDS = [
  COMMAND.CONNECT,
  COMMAND.DISCONNECT,
  COMMAND.ATTACH_DEPOT
]

// export const COMMANDS_BY_LEVEL: { [level: number]: COMMAND[] } = {
//   0: [
//     COMMAND.HELP,
//     COMMAND.BLINK,
//     COMMAND.SKIP,
//     // ... Hidden
//     COMMAND.START,
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
//     COMMAND.START,
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
//     COMMAND.START,
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
//     COMMAND.START,
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
//     COMMAND.START,
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
}

export const FULL_MACHINES = [
  MACHINE_TYPE.SPLITTER,
  MACHINE_TYPE.MIXER,
  MACHINE_TYPE.DRYER,
  MACHINE_TYPE.WETTER,
  MACHINE_TYPE.BOILER,
  MACHINE_TYPE.COOLER,
]

export const MACHINES_BY_LEVEL: { [level: number]: MACHINE_TYPE[] } = {
  0: FULL_MACHINES,
  1: FULL_MACHINES,
  2: FULL_MACHINES,
  3: FULL_MACHINES,
  4: FULL_MACHINES,
}

// export const MACHINES_BY_LEVEL: { [level: number]: MACHINE_TYPE[] } = {
//   0: [],
//   1: [],
//   2: [],
//   3: [
//     MACHINE_TYPE.MIXER,
//     MACHINE_TYPE.COOLER,
//   ],
//   4: [
//     MACHINE_TYPE.MIXER,
//     MACHINE_TYPE.COOLER,
//     MACHINE_TYPE.SPLITTER,
//     MACHINE_TYPE.BOILER,
//   ],
//   5: FULL_MACHINES,
//   6: FULL_MACHINES,
//   7: FULL_MACHINES,
//   8: [],
//   9: []
// }

export const FIXED_MACHINE_TYPES = [MACHINE_TYPE.PLAYER, MACHINE_TYPE.INLET, MACHINE_TYPE.OUTLET]
export const BETWEEN_SQUARE_BRACKETS = /(?<=\[).+?(?=\])/g
export const BETWEEN_BRACKETS = /(?<=\().+?(?=\))/g
export const BETWEEN_CARETS = /(?<=\>).+?(?=\<)/g
