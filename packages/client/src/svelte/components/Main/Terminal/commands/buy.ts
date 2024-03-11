import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, OutputType } from "@components/Main/Terminal/types";
import { buy as sendBuy } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";

async function execute() {
    try {
        writeToTerminal(OutputType.NORMAL, "Setting up purchase...")
        // ...
        const action = sendBuy()
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Purchase in progress...")
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

export const buy: Command<[]> = {
    id: COMMAND.BUY,
    public: false,
    name: "buy",
    alias: "p",
    description: "Buy bugs",
    fn: execute,
}