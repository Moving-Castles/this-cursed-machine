import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { disconnectStorage as sendDisconnectStorage } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../modules/sound";
import { MachineType, } from "../../../modules/state/enums";

async function execute(machineType: MachineType.INLET | MachineType.OUTLET) {
    try {
        writeToTerminal(OutputType.NORMAL, "Locating storage...")
        // ...
        const action = sendDisconnectStorage(machineType)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Disconnection in progress...")
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

export const disconnectStorage: Command<[machineType: MachineType.INLET | MachineType.OUTLET]> = {
    id: COMMAND.DISCONNECT_STORAGE,
    public: true,
    name: "disconnectStorage",
    alias: "y",
    description: "Disconnect storage",
    fn: execute,
}