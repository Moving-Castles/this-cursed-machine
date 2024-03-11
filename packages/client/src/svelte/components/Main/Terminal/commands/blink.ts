import { flashEffect } from "@components/Main/Terminal/functions/helpers";
import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TerminalType } from "@components/Main/Terminal/types";
import { playSound } from "@modules/sound";

async function execute(terminalType: TerminalType) {
    playSound("tcm", "blink")
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