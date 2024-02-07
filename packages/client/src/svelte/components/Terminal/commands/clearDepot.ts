import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { clearDepot as sendClearDepot } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../modules/sound";

async function execute(depotEntity: string) {
    try {
        writeToTerminal(OutputType.NORMAL, "Locating depot...")
        // ...
        const action = sendClearDepot(depotEntity,)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Clearing depot...")
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

export const clearDepot: Command<[depotEntity: string]> = {
    id: COMMAND.CLEAR_DEPOT,
    public: true,
    name: "clearDepot",
    alias: "q",
    description: "Clear depot",
    fn: execute,
}