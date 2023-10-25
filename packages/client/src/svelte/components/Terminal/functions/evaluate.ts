import { commands } from "../commands"
import { Command, TerminalType } from "../types"
import { terminalTypeCommandFilter } from "./helpers"

/**
 * Evaluates the provided input, cleans it, and finds a matching command.
 * @param {string} input - The string to evaluate.
 * @returns {Command|undefined} Returns the matched command object if found, otherwise logs an error and returns undefined.
 */
export function evaluate(input: string, terminalType: TerminalType): Command | undefined {
  // Clean input
  const cleanInput = input.toLowerCase().trim()
  // Find command
  return commands.find(command => terminalTypeCommandFilter(terminalType, command.id) && (command.name === cleanInput || command.alias === cleanInput))
}