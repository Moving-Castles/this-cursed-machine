import type { Command } from "../types";
import { COMMAND } from "../types";
import { terminalOutput } from "..";

async function execute() {
    terminalOutput.set([])
    return;
}

export const clear: Command<[]> = {
    id: COMMAND.CLEAR,
    public: true,
    name: "clear",
    alias: ".",
    description: "Clear terminal",
    fn: execute,
}