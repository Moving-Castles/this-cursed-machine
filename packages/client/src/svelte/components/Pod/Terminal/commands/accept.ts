import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { accept as sendAccept } from "../../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../../modules/sound";

async function execute(orderEntity: string) {
    try {
        writeToTerminal(OutputType.NORMAL, "Searching for order...")
        // ...
        const action = sendAccept(orderEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "In progress...")
        await waitForCompletion(action, loadingLine)
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

export const accept: Command<[orderEntity: string]> = {
    id: COMMAND.ACCEPT,
    public: true,
    name: "accept",
    alias: "a",
    description: "Accept order",
    fn: execute,
}