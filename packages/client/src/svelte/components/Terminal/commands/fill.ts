import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { fill as sendFill } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../modules/sound";

async function execute(storageEntity: string) {
    try {
        writeToTerminal(OutputType.NORMAL, "Filling order...")
        // ...
        const action = sendFill(storageEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Fullfillment in progress...")
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

export const fill: Command<[storageEntity: string]> = {
    id: COMMAND.FILL,
    public: true,
    name: "fill",
    alias: "f",
    description: "Fill order",
    fn: execute,
}