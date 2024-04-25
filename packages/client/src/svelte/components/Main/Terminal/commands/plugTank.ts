import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
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
import { plugTank as sendPlugTank } from "@modules/action"

async function execute(tankEntity: string, targetEntity: string) {
  try {
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Locating tank...")
    // ...
    const action = sendPlugTank(tankEntity, targetEntity)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Plugging in...")
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "plugTank")
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

export const plugTank: Command<[tankEntity: string, targetEntity: string]> = {
  id: COMMAND.PLUG_TANK,
  public: true,
  name: "plug",
  alias: "p",
  objectTerm: "tank",
  fn: execute,
}
