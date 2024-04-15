import type { Command } from "@components/Main/Terminal/types"
import { PORT_INDEX } from "@modules/state/base/enums"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { disconnect as sendDisconnect } from "@modules/action"
import {
  loadingLine,
  loadingSpinner,
  writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound"

async function execute(sourceMachine: string, portIndex: PORT_INDEX) {
  try {
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Approval pending")
    // ...
    const action = sendDisconnect(sourceMachine, portIndex)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Disconnecting...")
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "TRX_yes")
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

export const disconnect: Command<[connectionEntiy: string, portIndex: PORT_INDEX]> = {
  id: COMMAND.DISCONNECT,
  public: true,
  name: "disconnect",
  alias: "d",
  objectTerm: "machine",
  fn: execute,
}
