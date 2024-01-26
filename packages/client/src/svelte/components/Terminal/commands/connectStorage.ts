import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { connectStorage as sendConnectStorage } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { playSound } from "../../../modules/sound";
import { MachineType, } from "../../../modules/state/enums";

async function execute(storageEntity: string, machineType: MachineType.INLET | MachineType.OUTLET) {
    try {
        writeToTerminal(OutputType.NORMAL, "Locating storage...")
        // ...
        const action = sendConnectStorage(storageEntity, machineType)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(OutputType.NORMAL, "Connection in progress...")
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

export const connectStorage: Command<[storageEntity: string, machineType: MachineType.INLET | MachineType.OUTLET]> = {
    id: COMMAND.CONNECT_STORAGE,
    public: true,
    name: "connectStorage",
    alias: "s",
    description: "Connect storage",
    fn: execute,
}