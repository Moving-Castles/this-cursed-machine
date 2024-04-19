import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { buildMachine as sendBuildMachine } from "@modules/action"
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { MACHINE_TYPE } from "@modules/state/base/enums"
import { playSound } from "@modules/sound";

async function execute(machineType: MACHINE_TYPE) {
  try {
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Requesting material")

    const action = sendBuildMachine(machineType)
    // ...
    await waitForTransaction(action, loadingSpinner)
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, `Building ${MACHINE_TYPE[machineType]}`)
    // ...
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

export const buildMachine: Command<[machineType: MACHINE_TYPE]> = {
  id: COMMAND.BUILD_MACHINE,
  public: true,
  name: "build",
  alias: "b",
  objectTerm: "machine",
  fn: execute,
}
