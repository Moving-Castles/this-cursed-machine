import { tick } from "svelte"
import { COMMAND, SelectOption } from "../types"
import { COMMANDS_BY_LEVEL, terminalOutput } from ".."
import { machineTypeToLabel } from "../../../modules/state/convenience"
import { MachineType } from "../../../modules/state/enums"

/**
 * Scrolls the terminal output element to its end to ensure the latest output is visible.
 * @returns {Promise<void>} - A promise indicating the completion of the scrolling operation.
 */
export async function scrollToEnd(): Promise<void> {
  const outputElement = document.querySelector("#terminal")
  if (outputElement) {
    await tick()
    outputElement.scrollTop = outputElement.scrollTop + 10000
  }
}

export function levelCommandFilter(level: number, commandId: COMMAND): boolean {
  return COMMANDS_BY_LEVEL[level].includes(commandId) ? true : false
}

/**
 * Display a full-screen flash effect that lasts for 100ms.
 *
 * @returns {Promise<void>} Resolves once the flash effect completes.
 */
export async function flashEffect(): Promise<void> {
  return new Promise(resolve => {
    // Create a new div element
    const flashDiv = document.createElement("div")

    // Assign the 'flash-effect' class to it
    flashDiv.className = "flash"

    // Append it to the body
    document.body.appendChild(flashDiv)

    // Remove the div after 100ms and resolve the promise
    setTimeout(() => {
      document.body.removeChild(flashDiv)
      resolve()
    }, 50)
  })
}

export function clearTerminalOutput() {
  terminalOutput.set([])
}

/**
 * Orders an array of SelectOption objects with 'inlet' first, 'outlet' last,
 * and the rest in alphabetical order by the 'label' property.
 * @param {SelectOption[]} array - The array of SelectOption objects to be sorted.
 * @returns {SelectOption[]} - The sorted array.
 */
export function connectionMachineSort(array: SelectOption[]): SelectOption[] {
  // Order =>
  // INLET
  // PLAYER
  // ... All other machines in alphabetical order
  // OUTLET
  return array.sort((a, b) => {
    if (a.label === machineTypeToLabel(MachineType.INLET)) return -1
    if (b.label === machineTypeToLabel(MachineType.INLET)) return 1
    if (a.label === machineTypeToLabel(MachineType.OUTLET)) return 1
    if (b.label === machineTypeToLabel(MachineType.OUTLET)) return -1
    return a.label.localeCompare(b.label)
  })
}
