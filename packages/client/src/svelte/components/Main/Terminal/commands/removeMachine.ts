import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { removeMachine as sendRemoveMachine } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { simulatedMachines } from "@modules/state/simulated/stores";
import { get } from "svelte/store";
import { MACHINE_TYPE } from "@modules/state/base/enums";
import { playSound } from "@modules/sound";

async function execute(machineEntity: string) {
    try {
        const machine = get(simulatedMachines)[machineEntity]

        // @todo: handle this better
        if (!machine || !machine.machineType) return

        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, `Destroying ${MACHINE_TYPE[machine.machineType]}`)
        // ...
        const action = sendRemoveMachine(machineEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        await waitForCompletion(action, loadingLine);
        playSound("tcm", "TRX_yes")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")
        // ...
        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
        return
    }
}

export const removeMachine: Command<[machineEntiy: string]> = {
    id: COMMAND.REMOVE_MACHINE,
    public: true,
    name: "remove",
    alias: "r",
    objectTerm: "machine",
    fn: execute,
}