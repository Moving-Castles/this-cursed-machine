import type { Command } from "../types";
import { COMMAND } from "../types";
import { spawn, transfer } from "../../../modules/action";
import { loadingLine, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"

async function execute() {
    writeToTerminal(OutputType.NORMAL, "Skipping intro...")

    writeToTerminal(OutputType.NORMAL, "Spawning")
    const spawnAction = spawn()
    await waitForTransaction(spawnAction);
    await waitForCompletion(spawnAction, loadingLine);
    writeToTerminal(OutputType.SUCCESS, "Spawn done")

    writeToTerminal(OutputType.NORMAL, "Transferring")
    const transferAction = transfer()
    await waitForTransaction(transferAction);
    await waitForCompletion(transferAction, loadingLine);
    writeToTerminal(OutputType.SUCCESS, "Transfer done")

    return;
}

export const skip: Command<[]> = {
    id: COMMAND.SKIP,
    public: false,
    name: "skip",
    alias: "s",
    description: "Skip intro",
    fn: execute,
}