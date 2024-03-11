import { flashEffect } from "@components/Main/Terminal/functions/helpers";
import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TerminalType } from "@components/Main/Terminal/types";
import { playSound } from "@modules/sound";
import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers";

async function execute(terminalType: TerminalType) {
    playSound("tcm", "blink")
    await flashEffect()
    // Not working currently because terminalType is not passed on
    if (terminalType === TerminalType.FULL) clearTerminalOutput()
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