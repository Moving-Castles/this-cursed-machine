import { get } from "svelte/store"
import { player } from "@modules/state/base/stores"
import { commands } from "@components/Main/Terminal/commands"
import { Command } from "@components/Main/Terminal/types"
import { levelCommandFilter } from "@components/Main/Terminal/functions/helpers"

/**
 * Evaluates the provided input, cleans it, and finds a matching command.
 * @param {string} input - The string to evaluate.
 * @returns {Command|undefined} Returns the matched command object if found, otherwise returns undefined.
 */
export function evaluate(input: string): Command | undefined {
  const cleanInput = input.toLowerCase().trim()
  return commands.find(command => levelCommandFilter(get(player)?.level || 0, command.id) && (command.name === cleanInput || command.alias === cleanInput))
}