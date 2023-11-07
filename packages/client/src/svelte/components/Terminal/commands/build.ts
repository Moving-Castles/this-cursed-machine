import type { Command } from "../types"
import { COMMAND } from "../types"
import { build as sendBuild } from "../../../modules/action"
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal"
import { waitForCompletion, waitForTransaction } from "../functions/helpers"
import { OutputType } from "../types"
import { MachineType } from "../../../modules/state/enums"
import { playSound } from "../../../modules/sound";

async function execute(machineType: MachineType) {
  writeToTerminal(OutputType.NORMAL, "Requesting material")

  const action = sendBuild(machineType)
  // ...
  await waitForTransaction(action, loadingSpinner)
  writeToTerminal(OutputType.NORMAL, `Building ${MachineType[machineType]}`)
  // ...
  await waitForCompletion(action, loadingLine)
  playSound("tcm", "TRX_yes")
  await writeToTerminal(OutputType.SUCCESS, "Done")
  // ...
  return
}

export const build: Command<[machineType: MachineType]> = {
  id: COMMAND.BUILD,
  public: true,
  name: "build",
  alias: "b",
  description: "Build machine",
  fn: execute,
}
