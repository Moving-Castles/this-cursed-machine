import type { Command } from "../types";
import { COMMAND } from "../types";
import { destroy as sendDestroy } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../../../modules/action/actionSequencer/utils"
import { OutputType } from "../types"
import { simulatedMachines } from "../../../modules/simulator";
import { get } from "svelte/store";
import { MachineType } from "../../../modules/state/enums";
import { playSound } from "../../../modules/sound";

async function execute(machineEntity: string) {
    try {
        const machine = get(simulatedMachines)[machineEntity]

        // @todo: handle this better
        if (!machine || !machine.machineType) return

        writeToTerminal(OutputType.NORMAL, `Destroying ${MachineType[machine.machineType]}`)
        // ...
        const action = sendDestroy(machineEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        await waitForCompletion(action, loadingLine);
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

export const destroy: Command<[machineEntiy: string]> = {
    id: COMMAND.DESTROY,
    public: true,
    name: "destroy",
    alias: "d",
    description: "Remove machine",
    fn: execute,
}