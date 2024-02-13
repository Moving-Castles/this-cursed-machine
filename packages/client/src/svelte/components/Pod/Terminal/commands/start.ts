import type { Command } from "../types";
import { COMMAND } from "../types";
import { start as sendStart } from "../../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../../modules/action/actionSequencer/utils"
import { OutputType } from "../types"
import { playSound } from "../../../../modules/sound";

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