import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { detachDepot as sendDetachDepot } from "@modules/action"
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

async function execute(depotEntity: string) {
  try {
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Locating depot...")
    // ...
    const action = sendDetachDepot(depotEntity)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Detachment in progress...")
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

export const detachDepot: Command<[depotEntity: string]> = {
  id: COMMAND.DETACH_DEPOT,
  public: true,
  name: "detach",
  alias: "u",
  description: "Detach depot",
  fn: execute,
}
