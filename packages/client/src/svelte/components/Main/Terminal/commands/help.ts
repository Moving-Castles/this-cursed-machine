import type { Command } from "@components/Main/Terminal/types";
import { COMMAND } from "@components/Main/Terminal/types";
import { writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { commands } from "@components/Main/Terminal/commands";
import { SYMBOLS } from "@components/Main/Terminal/";
import { OutputType, TerminalType } from "@components/Main/Terminal/types"
import { levelCommandFilter } from "@components/Main/Terminal/functions/helpers";
import { player } from "@modules/state/base/stores";
import { get } from "svelte/store";
import { playSound } from "@modules/sound";

async function execute(terminalType: TerminalType) {
    // Get subset if not full terminal
    const commandList = commands.filter(command => levelCommandFilter(get(player)?.level || 0, command.id) && command.public)

    // List all available commands
    for (let i = 0; i < commandList.length; i++) {
        let command = commandList[i]
        let outputString = `(${command.alias}) ${command.name}`
        playSound("tcm", "listPrint")
        await writeToTerminal(OutputType.HELP, outputString, false, SYMBOLS[13], 20)
    }

    return;
}

export const help: Command<[terminalType: TerminalType]> = {
    id: COMMAND.HELP,
    public: true,
    name: "help",
    alias: "h",
    description: "Get help",
    fn: execute,
}