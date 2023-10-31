import type { Command } from "../types";
import { COMMAND } from "../types";
import { clearTerminalOutput } from "../functions/helpers";
import { playSound } from "../../../modules/sound";

async function execute() {
    playSound("tcm2", "TRX_no")
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