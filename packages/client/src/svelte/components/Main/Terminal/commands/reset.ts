import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { reset as sendReset } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";

async function execute() {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Destroying everything...")
        writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "THIS CANNOT BE UNDONE...")
        // ...
        const action = sendReset()
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Destruction in progress...")
        await waitForCompletion(action, loadingLine)
        playSound("tcm", "TRX_yes")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")
        // ...
        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
        return
    }
}

export const reset: Command<[]> = {
    id: COMMAND.RESET,
    public: true,
    name: "reset",
    alias: "r",
    description: "Reset pod",
    fn: execute,
}