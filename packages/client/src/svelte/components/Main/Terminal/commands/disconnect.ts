import type { Command } from "@components/Main/Terminal/types"
import { PORT_INDEX } from "@modules/state/base/enums"
import { COMMAND } from "@components/Main/Terminal/types"
import { disconnect as sendDisconnect } from "@modules/action"
import {
  loadingLine,
  loadingSpinner,
  writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { OutputType } from "@components/Main/Terminal/types"
import { playSound } from "@modules/sound"

async function execute(sourceMachine: string, portIndex: PORT_INDEX) {
  try {
    writeToTerminal(OutputType.NORMAL, "Approval pending")
    // ...
    const action = sendDisconnect(sourceMachine, portIndex)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(OutputType.NORMAL, "Disconnecting...")
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "TRX_yes")
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return
  } catch (error) {
    console.error(error)
    playSound("tcm", "TRX_no")
    await writeToTerminal(OutputType.ERROR, "Command failed")
    return
  }
}

export const disconnect: Command<[connectionEntiy: string, portIndex: PORT_INDEX]> = {
  id: COMMAND.DISCONNECT,
  public: true,
  name: "disconnect",
  alias: "x",
  description: "Remove connection",
  fn: execute,
}
