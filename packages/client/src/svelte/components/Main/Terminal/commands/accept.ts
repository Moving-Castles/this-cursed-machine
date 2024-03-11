import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, OutputType } from "@components/Main/Terminal/types";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";
import { accept as sendAccept } from "@modules/action";

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