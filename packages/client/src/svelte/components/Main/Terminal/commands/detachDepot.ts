import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, OutputType } from "@components/Main/Terminal/types";
import { detachDepot as sendDetachDepot } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";

async function execute(depotEntity: string) {
    try {
        writeToTerminal(OutputType.NORMAL, "Locating depot...")
        // ...
        const action = sendDetachDepot(depotEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Detachment in progress...")
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

export const detachDepot: Command<[depotEntity: string]> = {
    id: COMMAND.DETACH_DEPOT,
    public: true,
    name: "detachDepot",
    alias: "u",
    description: "Detach depot",
    fn: execute,
}