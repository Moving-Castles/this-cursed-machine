import type { Command } from "@components/Main/Terminal/types";
import { COMMAND } from "@components/Main/Terminal/types";
import { resolve as sendResolve } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { OutputType } from "@components/Main/Terminal/types"
import { playSound } from "@modules/sound";

async function execute() {
    try {
        writeToTerminal(OutputType.NORMAL, "Starting resolver...")
        const action = sendResolve()
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Resolving network...")
        await waitForCompletion(action, loadingLine);
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

export const resolve: Command<[]> = {
    id: COMMAND.RESOLVE,
    public: false,
    name: "resolve",
    alias: "r",
    description: "Resolve the network",
    fn: execute,
}