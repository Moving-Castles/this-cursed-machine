import type { Command } from "../types";
import { COMMAND } from "../types";
import { restart as sendRestart } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";

async function execute() {
    writeToTerminal(OutputType.NORMAL, "Restarting...")
    const action = sendRestart()
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(OutputType.NORMAL, "Sending restart transaction...")
    await waitForCompletion(action, loadingLine);
    playSound("tcm2", "TRX_yes")
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const restart: Command<[]> = {
    id: COMMAND.RESTART,
    public: false,
    name: "restart",
    alias: "¬",
    description: "Resolve the network",
    fn: execute,
}