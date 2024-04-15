import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { graduate as sendGraduate } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";
import { tutorialProgress } from "@modules/ui/assistant";
import { FINAL_TUTORIAL_LEVEL } from "@modules/ui/constants"

async function execute() {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "FF...")
        // ...
        const action = sendGraduate()
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "FF in progress...")
        await waitForCompletion(action, loadingLine)
        // Leave client tutorial as well
        tutorialProgress.set(FINAL_TUTORIAL_LEVEL)
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

export const graduate: Command<[]> = {
    id: COMMAND.GRADUATE,
    public: false,
    name: "graduate",
    alias: "g",
    fn: execute,
}