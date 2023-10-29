import { flashEffect } from "../functions/helpers";
import type { Command } from "../types";
import { COMMAND, TerminalType } from "../types";

async function execute(terminalType: TerminalType) {
    await flashEffect()
    return;
}

export const blink: Command<[terminalType: TerminalType]> = {
    id: COMMAND.BLINK,
    public: true,
    name: "blink",
    alias: ".",
    description: "...",
    fn: execute,
}