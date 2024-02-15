import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { attachDepot as sendAttachDepot } from "../../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../../modules/sound";

async function execute(depotEntity: string, targetEntity: string) {
    try {
        writeToTerminal(OutputType.NORMAL, "Locating depot...")
        // ...
        const action = sendAttachDepot(depotEntity, targetEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Attachment in progress...")
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

export const attachDepot: Command<[depotEntity: string, targetEntity: string]> = {
    id: COMMAND.ATTACH_DEPOT,
    public: true,
    name: "attachDepot",
    alias: "s",
    description: "Attach depot",
    fn: execute,
}