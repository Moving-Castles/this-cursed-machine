import type { Command } from "../types";
import { COMMAND } from "../types";
import { transfer as sendTransfer } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";

async function execute() {
    try {
        writeToTerminal(OutputType.NORMAL, "Attempting transfer..")
        const action = sendTransfer()
        // ...
        await waitForTransaction(action, loadingSpinner);
        // ...
        writeToTerminal(OutputType.NORMAL, "Transfer in progress...")
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
    id: COMMAND.TRANSFER,
    public: false,
    name: "transfer",
    alias: "t",
    description: "Move to next level",
    fn: execute,
}