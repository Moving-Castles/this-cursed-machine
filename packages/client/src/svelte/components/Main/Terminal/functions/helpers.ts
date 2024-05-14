import { tick } from "svelte"
import { COMMAND, TERMINAL_TYPE } from "@components/Main/Terminal/enums"
import { SelectOption } from "@components/Main/Terminal/types"
import { commandsByTutorialProgress, SPAWN_COMMANDS } from "@components/Main/Terminal/"
import { terminalOutput } from "@components/Main/Terminal/stores"
import { machineTypeToLabel } from "@modules/state/simulated"
import { MACHINE_TYPE } from "@modules/state/base/enums"
import {
  FIXED_POSITIONS,
  DYNAMIC_POSITIONS,
} from "@components/Main/Tabs/Pod/Graph/layout"

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

export function commandFilter(terminalType: TERMINAL_TYPE, level: number, commandId: COMMAND): boolean {
  if (terminalType === TERMINAL_TYPE.SPAWN) {
    return SPAWN_COMMANDS.includes(commandId) ? true : false
  }
  return commandsByTutorialProgress(level)?.includes(commandId) ? true : false
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

    // Assign the 'flash' class to it
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
    if (a.label === machineTypeToLabel(MACHINE_TYPE.INLET)) return -1
    if (b.label === machineTypeToLabel(MACHINE_TYPE.INLET)) return 1
    if (a.label === machineTypeToLabel(MACHINE_TYPE.OUTLET)) return 1
    if (b.label === machineTypeToLabel(MACHINE_TYPE.OUTLET)) return -1
    return a.label.localeCompare(b.label)
  })
}

/** Orders an array of machine entries with
 * player first
 * and then clockwise from inlet 1
 * */
export function machinePositionSort(a, b) {
  // FIXED POSITIONS
  const ALL_POSITIONS = [
    ...Object.values(FIXED_POSITIONS),
    ...DYNAMIC_POSITIONS,
  ]

  let [aPositionIndex, bPositionIndex] = [-1, -1]

  if (a[1].machineType === MACHINE_TYPE.INLET) {
    aPositionIndex = 0
  } else if (a[1].machineType === MACHINE_TYPE.PLAYER) {
    aPositionIndex = 1
    // console.log("PLAYER")
  } else if (a[1].machineType === MACHINE_TYPE.OUTLET) {
    aPositionIndex = 2
    // console.log("OUTLET")
  } else {
    aPositionIndex = ALL_POSITIONS.findIndex(
      coord => coord.x === a[1].x && coord.y === a[1].y
    )
  }

  if (b[1].machineType === MACHINE_TYPE.INLET) {
    bPositionIndex = 0
  } else if (b[1].machineType === MACHINE_TYPE.PLAYER) {
    bPositionIndex = 1
    // console.log("PLAYER")
  } else if (b[1].machineType === MACHINE_TYPE.OUTLET) {
    bPositionIndex = 2
    // console.log("OUTLET")
  } else {
    bPositionIndex = ALL_POSITIONS.findIndex(
      coord => coord.x === b[1].x && coord.y === b[1].y
    )
  }

  return aPositionIndex - bPositionIndex
}
