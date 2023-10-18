import type { Command } from "../types";
import { COMMAND } from "../types";
import { writeToTerminal } from "../functions/writeToTerminal";
import { OutputType } from "../types"

async function execute(machineEntity: string) {
    writeToTerminal(OutputType.NORMAL, `Inspecting ${machineEntity}`)
    // Output info...
    await new Promise((resolve) => setTimeout(resolve, 500))
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