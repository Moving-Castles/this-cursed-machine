import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { graduate as sendGraduate } from "../../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../../modules/sound";

async function execute() {
    try {
        writeToTerminal(OutputType.NORMAL, "FF...")
        // ...
        const action = sendGraduate()
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "FF in progress...")
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

export const graduate: Command<[]> = {
    id: COMMAND.GRADUATE,
    public: false,
    name: "graduate",
    alias: "g",
    description: "Skip tutorial",
    fn: execute,
}