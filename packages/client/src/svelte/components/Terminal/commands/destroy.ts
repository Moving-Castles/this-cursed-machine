import type { Command } from "../types";
import { COMMAND } from "../types";
import { destroy as sendDestroy } from "../../../modules/action";
import { loadingLine, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { OutputType } from "../types"
import { playSound } from "../../../modules/sound";
import { simulatedMachines } from "../../../modules/simulator";
import { get } from "svelte/store";
import { MachineType } from "../../../modules/state/enums";

async function execute(machineEntity: string) {

    const machine = get(simulatedMachines)[machineEntity]

    // @todo: handle this better
    if (!machine || !machine.machineType) return

    writeToTerminal(OutputType.NORMAL, `Destroying ${MachineType[machine.machineType]}`)
    // ...
    const action = sendDestroy(machineEntity)
    // ...
    await waitForTransaction(action);
    // ...
    await waitForCompletion(action, loadingLine);
    playSound("tcm", "swipe5")
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const destroy: Command<[machineEntiy: string]> = {
    id: COMMAND.DESTROY,
    public: true,
    name: "destroy",
    alias: "d",
    description: "Remove machine",
    fn: execute,
}