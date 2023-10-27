import type { Command } from "../types";
import { COMMAND } from "../types";
import { connect as sendConnect } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";

async function execute(sourcePort: string, targetPort: string) {
    writeToTerminal(OutputType.NORMAL, "Allocating pipe...")
    // ...
    const action = sendConnect(sourcePort, targetPort)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(OutputType.NORMAL, "Connection in progress...")
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "swipe5")
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const connect: Command<[sourcePort: string, targetPort: string]> = {
    id: COMMAND.CONNECT,
    public: true,
    name: "connect",
    alias: "c",
    description: "Connect machine",
    fn: execute,
}