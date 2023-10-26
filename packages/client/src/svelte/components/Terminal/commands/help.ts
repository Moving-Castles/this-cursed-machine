import type { Command } from "../types";
import { COMMAND } from "../types";
import { writeToTerminal } from "../functions/writeToTerminal";
import { commands } from ".";
import { SYMBOLS } from "..";
import { OutputType, TerminalType } from "../types"
import { terminalTypeCommandFilter } from "../functions/helpers";

async function execute(terminalType: TerminalType) {
    // Get subset if not full terminal
    const commandList = commands.filter(command => terminalTypeCommandFilter(terminalType, command.id) && command.public)

    // List all available commands
    for (let i = 0; i < commandList.length; i++) {
        let command = commandList[i]
        let outputString = `(${command.alias}) ${command.name}`
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