import type { Command } from "@components/Main/Terminal/types"
import { writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
import { commands } from "@components/Main/Terminal/commands"
import { SYMBOLS } from "@components/Main/Terminal/"
import {
  TERMINAL_OUTPUT_TYPE,
  TERMINAL_TYPE,
  COMMAND,
} from "@components/Main/Terminal/enums"
import { commandFilter } from "@components/Main/Terminal/functions/helpers"
import { tutorialProgress } from "@modules/ui/assistant"
import { get } from "svelte/store"
import { playSound } from "@modules/sound"

async function execute(terminalType: TERMINAL_TYPE) {
  // Get subset if not full terminal
  const commandList = commands.filter(
    command =>
      commandFilter(terminalType, get(tutorialProgress) ?? 28, command.id) &&
      command.public
  )

  const categorisedCommands = [
    { objectTerm: "machine", commands: commandList.filter(command => command.objectTerm === "machine") },
    { objectTerm: "tank", commands: commandList.filter(command => command.objectTerm === "tank") },
    { objectTerm: "pod", commands: commandList.filter(command => command.objectTerm === "pod") },
    { objectTerm: "tokens", commands: commandList.filter(command => command.objectTerm === "tokens") },
    { objectTerm: "misc", commands: commandList.filter(command => !command.objectTerm) }
  ]

  // List all available commands
  for (let i = 0; i < categorisedCommands.length; i++) {

    if (categorisedCommands[i].commands.length === 0) continue

    playSound("tcm", "listPrint")
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.NORMAL,
      "--- " + categorisedCommands[i].objectTerm,
      false,
      SYMBOLS[13],
      20
    )

    for (let x = 0; x < categorisedCommands[i].commands.length; x++) {
      let command = categorisedCommands[i].commands[x]
      let outputString = `(${command.alias}) ${command.name}`
      playSound("tcm", "listPrint")
      await writeToTerminal(
        TERMINAL_OUTPUT_TYPE.INFO,
        outputString,
        false,
        SYMBOLS[14],
        20
      )
    }
  }

  return
}

export const help: Command<[terminalType: TERMINAL_TYPE]> = {
  id: COMMAND.HELP,
  public: true,
  name: "help",
  alias: "h",
  fn: execute,
}
