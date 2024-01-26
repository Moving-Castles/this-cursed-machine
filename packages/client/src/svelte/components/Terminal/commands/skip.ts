import type { Command } from "../types";
import { COMMAND } from "../types";
import { spawn, restart } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";

async function execute() {
    try {
        writeToTerminal(OutputType.NORMAL, "Skipping intro...")

        writeToTerminal(OutputType.NORMAL, "Spawning")
        const spawnAction = spawn()
        await waitForTransaction(spawnAction, loadingSpinner)
        await waitForCompletion(spawnAction, loadingLine);
        playSound("tcm", "TRX_yes")
        writeToTerminal(OutputType.SUCCESS, "Spawn done")

        writeToTerminal(OutputType.NORMAL, "Transferring")
        const restartAction = restart()
        await waitForTransaction(restartAction, loadingSpinner);
        await waitForCompletion(restartAction, loadingLine);
        playSound("tcm", "TRX_yes")
        writeToTerminal(OutputType.SUCCESS, "Transfer done")

        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(OutputType.ERROR, "Command failed")
        return
    }
}

export const skip: Command<[]> = {
    id: COMMAND.SKIP,
    public: false,
    name: "skip",
    alias: "*",
    description: "Skip intro",
    fn: execute,
}