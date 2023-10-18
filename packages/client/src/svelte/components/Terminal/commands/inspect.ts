import type { Command } from "../types";
import { COMMAND } from "../types";
import { writeToTerminal } from "../functions/writeToTerminal";
import { OutputType } from "../types"
import { simulatedMachines } from "../../../modules/simulator";
import { get } from "svelte/store";
import { MachineType, MaterialType } from "../../../modules/state/enums";
import { SYMBOLS } from "..";

async function execute(machineEntity: string) {
    const machine = get(simulatedMachines)[machineEntity]

    await writeToTerminal(OutputType.INFO, `Inspecting ${MachineType[machine.machineType]}`, false, SYMBOLS[6], 20)
    await writeToTerminal(OutputType.INFO, "+ + +", false, SYMBOLS[6], 20)
    // INPUTS
    await writeToTerminal(OutputType.INFO, "INPUT", false, SYMBOLS[1], 20)
    if (machine.inputs && machine.inputs.length > 0) {
        for (let i = 0; i < machine.inputs.length; i++) {
            let input = machine.inputs[i]
            await writeToTerminal(OutputType.INFO, `${MaterialType[input.materialType]} : ${input.amount}/block`, false, SYMBOLS[6], 20)
        }
    } else {
        await writeToTerminal(OutputType.INFO, "NONE", false, SYMBOLS[6], 20)
    }
    await writeToTerminal(OutputType.INFO, "+ + +", false, SYMBOLS[6], 20)
    // OUTPUTS
    await writeToTerminal(OutputType.INFO, "OUTPUT", false, SYMBOLS[1], 20)
    if (machine.outputs && machine.outputs.length > 0) {
        for (let i = 0; i < machine.outputs.length; i++) {
            let output = machine.outputs[i]
            await writeToTerminal(OutputType.INFO, `${MaterialType[output.materialType]} : ${output.amount}/block`, false, SYMBOLS[6], 20)
        }
    } else {
        await writeToTerminal(OutputType.INFO, "NONE", false, SYMBOLS[6], 20)
    }

    return;
}

export const inspect: Command<[machineEntiy: string]> = {
    id: COMMAND.INSPECT,
    public: true,
    name: "inspect",
    alias: "i",
    description: "Look at machine",
    fn: execute,
}