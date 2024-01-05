import { playerEntity } from "../../../modules/state"
import { commands } from "../commands"
import { Command } from "../types"
import { levelCommandFilter } from "./helpers"
import { get } from "svelte/store"

/**
 * Evaluates the provided input, cleans it, and finds a matching command.
 * @param {string} input - The string to evaluate.
 * @returns {Command|undefined} Returns the matched command object if found, otherwise returns undefined.
 */
export function evaluate(input: string): Command | undefined {
  const cleanInput = input.toLowerCase().trim()
  return commands.find(command => levelCommandFilter(get(playerEntity)?.level || 0, command.id) && (command.name === cleanInput || command.alias === cleanInput))
}