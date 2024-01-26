import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { clearStorage as sendClearStorage } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../modules/sound";

async function execute(storageEntity: string) {
    try {
        writeToTerminal(OutputType.NORMAL, "Locating storage...")
        // ...
        const action = sendClearStorage(storageEntity,)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Clearing storage...")
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

export const clearStorage: Command<[storageEntity: string]> = {
    id: COMMAND.CLEAR_STORAGE,
    public: true,
    name: "clearStorage",
    alias: "q",
    description: "Clear storage",
    fn: execute,
}