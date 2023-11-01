import { playerCore } from "../../../modules/state"
import { commands } from "../commands"
import { Command } from "../types"
import { levelCommandFilter } from "./helpers"
import { get } from "svelte/store"

/**
 * Evaluates the provided input, cleans it, and finds a matching command.
 * @param {string} input - The string to evaluate.
 * @returns {Command|undefined} Returns the matched command object if found, otherwise logs an error and returns undefined.
 */
export function evaluate(input: string): Command | undefined {
  // Clean input
  const cleanInput = input.toLowerCase().trim()
  // Find command
  return commands.find(command => levelCommandFilter(get(playerCore)?.level || 0, command.id) && (command.name === cleanInput || command.alias === cleanInput))
}