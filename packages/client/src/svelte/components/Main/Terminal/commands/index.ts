import type { Command } from "@components/Main/Terminal/types"

// Machine
import { buildMachine } from "@components/Main/Terminal/commands/buildMachine"
import { removeMachine } from "@components/Main/Terminal/commands/removeMachine"
import { connect } from "@components/Main/Terminal/commands/connect"
import { disconnect } from "@components/Main/Terminal/commands/disconnect"
// Tank
import { plugTank } from "@components/Main/Terminal/commands/plugTank"
import { unplugTank } from "@components/Main/Terminal/commands/unplugTank"
import { emptyTank } from "@components/Main/Terminal/commands/emptyTank"
import { fillTank } from "@components/Main/Terminal/commands/fillTank"
import { depositTokens } from "@components/Main/Terminal/commands/depositTokens"
import { shipTank } from "@components/Main/Terminal/commands/shipTank"
// Pod
import { wipePod } from "@components/Main/Terminal/commands/wipePod"
// Misc.
import { blink } from "@components/Main/Terminal/commands/blink"
import { help } from "@components/Main/Terminal/commands/help"
// Hidden
import { skip } from "@components/Main/Terminal/commands/skip"
import { resolve } from "@components/Main/Terminal/commands/resolve"

export const commands: Command[] = [
  // Machine
  buildMachine,
  removeMachine,
  connect,
  disconnect,
  // Tank
  plugTank,
  unplugTank,
  emptyTank,
  fillTank,
  shipTank,
  // Pod
  wipePod,
  // Tokens
  depositTokens,
  // Misc.
  help,
  blink,
  // Convenience
  resolve,
  skip
]
