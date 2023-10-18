import type { Command } from "../types";
import { COMMAND } from "../types";
import { resolve as sendResolve } from "../../../modules/action";
import { writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";

async function execute() {
    writeToTerminal(OutputType.NORMAL, "Starting resolver...")
    const action = sendResolve()
    // ...
    await waitForTransaction(action);
    // ...
    writeToTerminal(OutputType.NORMAL, "Resolving network...")
    await waitForCompletion(action);
    playSound("ui", "eventGood")
    writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const resolve: Command<[]> = {
    id: COMMAND.RESOLVE,
    public: false,
    name: "resolve",
    alias: "r",
    description: "Resolve the network",
    fn: execute,
}