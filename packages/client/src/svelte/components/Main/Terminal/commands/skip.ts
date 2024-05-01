import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { spawn, start } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";
import { initSignalNetwork } from "@modules/signal";

async function execute() {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Skipping intro...")

        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Spawning")
        const spawnAction = spawn("MEATBAG88")
        await waitForTransaction(spawnAction, loadingSpinner)
        await waitForCompletion(spawnAction, loadingLine);
        playSound("tcm", "TRX_yes")
        writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Spawn done")

        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Transferring")
        const startAction = start()
        await waitForTransaction(startAction, loadingSpinner);
        await waitForCompletion(startAction, loadingLine);
        playSound("tcm", "TRX_yes")
        writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Transfer done")

        // Websocket connection for off-chain messaging
        initSignalNetwork()

        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
        return
    }
}

export const skip: Command<[]> = {
    id: COMMAND.SKIP,
    public: false,
    name: "skip",
    alias: "*",
    fn: execute,
}