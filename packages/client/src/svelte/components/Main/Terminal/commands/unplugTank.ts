import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { unplugTank as sendUnplugTank } from "@modules/action"
import {
  loadingLine,
  loadingSpinner,
  writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import {
  waitForCompletion,
  waitForTransaction,
} from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound"

async function execute(tankEntity: string) {
  try {
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Locating tank...")
    // ...
    const action = sendUnplugTank(tankEntity)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Unplugging...")
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "selectionEsc2")
    await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")
    // ...
    return
  } catch (error) {
    console.error(error)
    playSound("tcm", "TRX_no")
    await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
    return
  }
}

export const unplugTank: Command<[tankEntity: string]> = {
  id: COMMAND.UNPLUG_TANK,
  public: true,
  name: "unplug",
  alias: "u",
  objectTerm: "tank",
  fn: execute,
}
