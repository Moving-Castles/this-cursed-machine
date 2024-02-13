import type { Command } from "../types";
import { OutputType } from "../types";
import { COMMAND } from "../types";
import { writeToTerminal } from "../functions/writeToTerminal";
import { showMap } from "../../../../modules/ui/stores";
import { SYMBOLS } from "..";
import { playSound } from "../../../../modules/sound";

async function execute() {
    showMap.set(true)
    await writeToTerminal(OutputType.NORMAL, "Loading material map...", false, SYMBOLS[5], 100)
    playSound("tcm", "mapPop")
    return;
}

export const map: Command<[]> = {
    id: COMMAND.MAP,
    public: true,
    name: "map",
    alias: "m",
    description: "Show material map",
    fn: execute,
}