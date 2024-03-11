import type { Command } from "@components/Main/Terminal/types";
import { COMMAND } from "@components/Main/Terminal/types";
import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers";
import { playSound } from "@modules/sound";

async function execute() {
    playSound("tcm", "TRX_no")
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