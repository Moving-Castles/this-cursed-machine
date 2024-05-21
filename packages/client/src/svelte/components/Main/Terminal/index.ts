import { COMMAND } from "@components/Main/Terminal/enums"
import { MACHINE_TYPE } from "@modules/state/base/enums"

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
  "»",
  "→",
  "√",
]

export const SPAWN_COMMANDS = [
  COMMAND.SKIP,
  COMMAND.BLINK,
  COMMAND.HELP,
]

export const FULL_COMMANDS = [
  COMMAND.BUILD_MACHINE,
  COMMAND.REMOVE_MACHINE,
  COMMAND.WIPE_POD,
  COMMAND.CONNECT,
  COMMAND.DISCONNECT,
  COMMAND.PLUG_TANK,
  COMMAND.UNPLUG_TANK,
  COMMAND.EMPTY_TANK,
  COMMAND.FILL_TANK,
  COMMAND.SHIP_TANK,
  COMMAND.DEPOSIT_TOKENS,
  COMMAND.RESOLVE,
  COMMAND.BLINK,
  COMMAND.HELP,
]

export const NO_INPUT_COMMANDS = [
  COMMAND.BLINK,
  COMMAND.HELP,
  COMMAND.RESOLVE,
  COMMAND.SKIP,
  COMMAND.WIPE_POD,
]

export const SINGLE_INPUT_COMMANDS = [
  COMMAND.BUILD_MACHINE,
  COMMAND.REMOVE_MACHINE,
  COMMAND.EMPTY_TANK,
  COMMAND.UNPLUG_TANK,
  COMMAND.FILL_TANK,
  COMMAND.SHIP_TANK,
]

export const MULTI_INPUT_COMMANDS = [
  COMMAND.CONNECT,
  COMMAND.DISCONNECT,
  COMMAND.PLUG_TANK,
  COMMAND.DEPOSIT_TOKENS,
]

export const COMMANDS_BY_LEVEL: { [level: number]: COMMAND[] } = {
  0: FULL_COMMANDS,
  1: FULL_COMMANDS,
  2: FULL_COMMANDS,
}

export const commandsByTutorialProgress = (level: number) => {
  if (level > 30) {
    return FULL_COMMANDS
  }

  if (level > 29) {
    return [COMMAND.BLINK]
  }

  if (level > 18) {
    return [
      COMMAND.BLINK,
      COMMAND.FILL_TANK,
      COMMAND.PLUG_TANK,
      COMMAND.UNPLUG_TANK,
      COMMAND.CONNECT,
      COMMAND.DISCONNECT,
      COMMAND.BUILD_MACHINE,
      COMMAND.REMOVE_MACHINE,
      COMMAND.SHIP_TANK,
      COMMAND.EMPTY_TANK,
      COMMAND.WIPE_POD,
      COMMAND.HELP
    ]
  }

  if (level > 12) {
    return [
      COMMAND.BLINK,
      COMMAND.FILL_TANK,
      COMMAND.PLUG_TANK,
      COMMAND.UNPLUG_TANK,
      COMMAND.CONNECT,
      COMMAND.DISCONNECT,
      COMMAND.SHIP_TANK,
      COMMAND.EMPTY_TANK,
      COMMAND.WIPE_POD,
      COMMAND.HELP
    ]
  }

  if (level > 8) {
    return [
      COMMAND.BLINK,
      COMMAND.FILL_TANK,
      COMMAND.PLUG_TANK,
      COMMAND.UNPLUG_TANK,
      COMMAND.CONNECT,
      COMMAND.DISCONNECT,
      COMMAND.EMPTY_TANK,
      COMMAND.SHIP_TANK,
      COMMAND.WIPE_POD,
      COMMAND.HELP
    ]
  }

  if (level > 7) {
    return [
      COMMAND.BLINK,
      COMMAND.FILL_TANK,
      COMMAND.PLUG_TANK,
      COMMAND.UNPLUG_TANK,
      COMMAND.HELP
    ]
  }

  if (level > 6) {
    return [COMMAND.BLINK, COMMAND.FILL_TANK, COMMAND.HELP]
  }

  if (level > -1) {
    return [COMMAND.BLINK, COMMAND.HELP, COMMAND.SKIP]
  }

  return []; // Handle the case where level is <= -1

}

export const FULL_MACHINES = [
  MACHINE_TYPE.SPLITTER,
  MACHINE_TYPE.MIXER,
  MACHINE_TYPE.DRYER,
  MACHINE_TYPE.BOILER,
  MACHINE_TYPE.CENTRIFUGE,
  MACHINE_TYPE.GRINDER,
  MACHINE_TYPE.RAT_CAGE,
  MACHINE_TYPE.MEALWORM_VAT
]

export const MACHINES_BY_LEVEL: { [level: number]: MACHINE_TYPE[] } = {
  0: [MACHINE_TYPE.DRYER],
  1: [MACHINE_TYPE.DRYER],
  2: [MACHINE_TYPE.DRYER],
  3: FULL_MACHINES,
}

export const FIXED_MACHINE_TYPES = [
  MACHINE_TYPE.PLAYER,
  MACHINE_TYPE.INLET,
  MACHINE_TYPE.OUTLET,
]
export const BETWEEN_SQUARE_BRACKETS = /(?<=\[).+?(?=\])/g
export const BETWEEN_BRACKETS = /(?<=\().+?(?=\))/g
export const BETWEEN_CARETS = /(?<=\>).+?(?=\<)/g
