import type { Command } from "../types";
import { COMMAND } from "../types";
import { transfer as sendTransfer } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"

async function execute() {
    writeToTerminal(OutputType.NORMAL, "Attempting transfer..")
    const action = sendTransfer()
    // ...
    await waitForTransaction(action, loadingSpinner);
    // ...
    writeToTerminal(OutputType.NORMAL, "Transfer in progress...")
    await waitForCompletion(action, loadingLine);
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const transfer: Command<[]> = {
    id: COMMAND.TRANSFER,
    public: false,
    name: "transfer",
    alias: "t",
    description: "Move to next level",
    fn: execute,
}