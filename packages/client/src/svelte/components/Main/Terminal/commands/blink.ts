import { flashEffect } from "@components/Main/Terminal/functions/helpers";
import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_TYPE } from "@components/Main/Terminal/enums";
import { playSound } from "@modules/sound";
import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers";

async function execute(terminalType: TERMINAL_TYPE) {
    playSound("tcm", "blink")
    await flashEffect()
    // Not working currently because terminalType is not passed on
    if (terminalType === TERMINAL_TYPE.FULL) clearTerminalOutput()
    return;
}

export const blink: Command<[terminalType: TERMINAL_TYPE]> = {
    id: COMMAND.BLINK,
    public: true,
    name: "blink",
    alias: ".",
    description: "...",
    fn: execute,
}