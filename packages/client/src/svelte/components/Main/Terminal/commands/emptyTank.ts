import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { emptyTank as sendEmptyTank } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";

async function execute(tankEntity: string) {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Locating tank...")
        // ...
        const action = sendEmptyTank(tankEntity,)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Emptying tank...")
        await waitForCompletion(action, loadingLine)
        playSound("tcm", "TRX_yes")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")
        // ...
        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
        return
    }
}

export const emptyTank: Command<[tankEntity: string]> = {
    id: COMMAND.EMPTY_TANK,
    public: true,
    name: "empty",
    alias: "e",
    objectTerm: "tank",
    fn: execute,
}