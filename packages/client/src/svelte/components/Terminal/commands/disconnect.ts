import type { Command } from "../types";
import { COMMAND } from "../types";
import { disconnect as sendDisconnect } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";

async function execute(connectionEntity: string) {
    writeToTerminal(OutputType.NORMAL, "Approval pending")
    // ...
    const action = sendDisconnect(connectionEntity)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(OutputType.NORMAL, "Disconnecting...")
    await waitForCompletion(action, loadingLine);
    playSound("tcm", "swipe5")
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const disconnect: Command<[connectionEntiy: string]> = {
    id: COMMAND.DISCONNECT,
    public: true,
    name: "disconnect",
    alias: "x",
    description: "Remove connection",
    fn: execute,
}