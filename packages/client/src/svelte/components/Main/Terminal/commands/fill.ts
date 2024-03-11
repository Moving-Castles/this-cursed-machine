import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, OutputType } from "@components/Main/Terminal/types";
import { fill as sendFill } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";

async function execute(depotEntity: string) {
    try {
        writeToTerminal(OutputType.NORMAL, "Filling order...")
        // ...
        const action = sendFill(depotEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Fullfillment in progress...")
        await waitForCompletion(action, loadingLine)
        playSound("tcm", "TRX_yes")
        await writeToTerminal(OutputType.SUCCESS, "Done")
        // ...
        playSound("tcm", "playerLvlend");
        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(OutputType.ERROR, "Command failed")
        return
    }
}

export const fill: Command<[depotEntity: string]> = {
    id: COMMAND.FILL,
    public: true,
    name: "fill",
    alias: "f",
    description: "Fill order",
    fn: execute,
}