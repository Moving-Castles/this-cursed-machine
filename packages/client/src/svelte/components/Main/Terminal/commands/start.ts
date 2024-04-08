import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { tutorialProgress } from "@modules/ui/assistant"
import { start as startAction } from "@modules/action"
import {
  loadingLine,
  loadingSpinner,
  writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"
import {
  waitForCompletion,
  waitForTransaction,
} from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound"

async function execute() {
  try {
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Rebooting...")

    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Erasing memory")
    const startActionTransaction = startAction()
    await waitForTransaction(startActionTransaction, loadingSpinner)
    await waitForCompletion(startActionTransaction, loadingLine)
    playSound("tcm", "TRX_yes")
    writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Memory erased")

    tutorialProgress.set(0)
    clearTerminalOutput()

    return
  } catch (error) {
    console.error(error)
    playSound("tcm", "TRX_no")
    await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
    return
  }
}

export const start: Command<[]> = {
  id: COMMAND.START,
  public: true,
  name: "start",
  alias: "\\",
  description: "Restart tutorial",
  fn: execute,
}
