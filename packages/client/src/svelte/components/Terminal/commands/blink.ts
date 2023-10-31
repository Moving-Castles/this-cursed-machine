import { flashEffect } from "../functions/helpers";
import type { Command } from "../types";
import { COMMAND, TerminalType } from "../types";
import { playSound } from "../../../modules/sound";

async function execute(terminalType: TerminalType) {
    playSound("tcm2", "blink")
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