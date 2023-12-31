import type { Command } from "../types";
import { COMMAND } from "../types";
import { complete as sendComplete } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";

async function execute() {
    try {
        writeToTerminal(OutputType.NORMAL, "Attempting complete..")
        const action = sendComplete()
        // ...
        await waitForTransaction(action, loadingSpinner);
        // ...
        writeToTerminal(OutputType.NORMAL, "Transaction in progress...")
        await waitForCompletion(action, loadingLine);
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

export const transfer: Command<[]> = {
    id: COMMAND.COMPLETE,
    public: false,
    name: "complete",
    alias: "˚",
    description: "Finish progression",
    fn: execute,
}