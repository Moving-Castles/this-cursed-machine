import type { Command } from "../types";
import { COMMAND } from "../types";
import { clearTerminalOutput } from "../functions/helpers";

async function execute() {
    clearTerminalOutput()
    return;
}

export const clear: Command<[]> = {
    id: COMMAND.CLEAR,
    public: true,
    name: "clear",
    alias: "-",
    description: "Clear terminal",
    fn: execute,
}