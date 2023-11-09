import type { Command } from "../types";
import { COMMAND } from "../types";
import { complete as sendComplete } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"

async function execute() {
    writeToTerminal(OutputType.NORMAL, "Attempting complete..")
    const action = sendComplete()
    // ...
    await waitForTransaction(action, loadingSpinner);
    // ...
    writeToTerminal(OutputType.NORMAL, "Transaction in progress...")
    await waitForCompletion(action, loadingLine);
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const transfer: Command<[]> = {
    id: COMMAND.COMPLETE,
    public: false,
    name: "complete",
    alias: "˚",
    description: "Finish progression",
    fn: execute,
}