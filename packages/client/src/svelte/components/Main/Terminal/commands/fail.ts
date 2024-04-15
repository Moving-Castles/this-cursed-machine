import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { build as sendBuild } from "@modules/action"
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal"
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { MACHINE_TYPE } from "@modules/state/base/enums"
import { playSound } from "@modules/sound";

async function execute() {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Requesting material")

        // Designed to fail
        const machineType = MACHINE_TYPE.PLAYER

        const action = sendBuild(machineType)
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

export const fail: Command<[]> = {
    id: COMMAND.FAIL,
    public: false,
    name: "fail",
    alias: "z",
    fn: execute,
}
