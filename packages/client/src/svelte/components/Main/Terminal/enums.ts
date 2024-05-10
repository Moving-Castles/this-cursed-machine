export enum TERMINAL_TYPE {
  FULL,
  SPAWN,
}

export enum DIRECTION {
  OUTGOING,
  INCOMING,
}

export enum TERMINAL_OUTPUT_TYPE {
  COMMAND,
  NORMAL,
  INFO,
  ALERT,
  SUCCESS,
  ERROR
}

export enum COMMAND {
  // Machine
  BUILD_MACHINE,
  REMOVE_MACHINE,
  CONNECT,
  DISCONNECT,
  // Tank
  PLUG_TANK,
  UNPLUG_TANK,
  EMPTY_TANK,
  FILL_TANK,
  SHIP_TANK,
  // Pod
  WIPE_POD,
  // Tokens
  DEPOSIT_TOKENS,
  // Misc.
  BLINK,
  HELP,
  // Hidden
  SKIP,
  GRADUATE,
  RESOLVE
}
