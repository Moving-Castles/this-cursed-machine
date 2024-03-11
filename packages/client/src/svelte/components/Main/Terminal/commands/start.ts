import type { Command } from "@components/Main/Terminal/types";
import { COMMAND } from "@components/Main/Terminal/types";
import { start as sendStart } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { OutputType } from "@components/Main/Terminal/types"
import { playSound } from "@modules/sound";

async function execute() {
    try {
        writeToTerminal(OutputType.NORMAL, "Starting...")
        const action = sendStart()
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Sending start transaction...")
        await waitForCompletion(action, loadingLine);
        playSound("tcm", "TRX_yes")
        await writeToTerminal(OutputType.SUCCESS, "Done")
        // ...
        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(OutputType.ERROR, "Command failed")
        return
    }
}

export const start: Command<[]> = {
    id: COMMAND.START,
    public: false,
    name: "start",
    alias: "¬",
    description: "Resolve the network",
    fn: execute,
}