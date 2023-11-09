import { tick } from "svelte"
import type { Action } from "../../../modules/action/actionSequencer"
import {
  simulatedConnections,
  simulatedMachines,
} from "../../../modules/simulator"
import { get } from "svelte/store"
import { SimulatedEntities } from "../../../modules/simulator/types"
import { COMMAND, SelectOption } from "../types"
import { COMMANDS_BY_LEVEL, terminalOutput } from ".."
import { machineTypeToLabel } from "../../../modules/state/convenience"
import { MachineType } from "../../../modules/state/enums"

/**
 * Scrolls the terminal output element to its end to ensure the latest output is visible.
 * @returns {Promise<void>} - A promise indicating the completion of the scrolling operation.
 */
export async function scrollToEnd() {
  const outputElement = document.querySelector("#terminal")
  if (outputElement) {
    await tick()
    outputElement.scrollTop = outputElement.scrollTop + 10000
  }
}

/**
 * Waits for the specified action's transaction to be set.
 *
 * @function waitForTransaction
 * @param {Action} action - The action object to check for a transaction.
 * @param {function} [loadingFunction] - An optional function to call while waiting for completion.
 * @returns {Promise<Action>} - A promise that resolves with the action once its transaction is set, or rejects after a certain number of retries.
 */
export const waitForTransaction = (
  action: Action,
  loadingFunction?: (index: number) => {}
): Promise<Action> => {
  return new Promise((resolve, reject) => {
    const maxRetries = 100
    let attempts = 0
    let index = 0

    const checkTransaction = () => {
      index++
      if (loadingFunction) loadingFunction(index)
      if (action.tx) {
        // check if tx is set (i.e., it has a truthy value)
        resolve(action)
      } else if (attempts < maxRetries) {
        attempts++
        // wait for some time before checking again
        setTimeout(checkTransaction, 100)
      } else {
        reject(new Error("Max retries reached without transaction."))
      }
    }

    checkTransaction()
  })
}

/**
 * Waits for the specified action to be completed.
 *
 * @function waitForCompletion
 * @param {Action} action - The action object to check for completion.
 * @param {function} [loadingFunction] - An optional function to call while waiting for completion.
 * @returns {Promise<Action>} - A promise that resolves with the action once it's completed, or rejects after a certain number of retries.
 */
export const waitForCompletion = (
  action: Action,
  loadingFunction?: (index: number) => {}
): Promise<Action> => {
  return new Promise((resolve, reject) => {
    const maxRetries = 100 // just an example, set to however many retries you want
    let attempts = 0
    let index = 0

    const checkCompletion = () => {
      index++
      if (loadingFunction) loadingFunction(index)
      if (action.completed) {
        resolve(action)
      } else if (action.failed) {
        reject(new Error("Action failed."))
      } else if (attempts < maxRetries) {
        attempts++
        // wait for some time before checking again
        setTimeout(checkCompletion, 100)
      } else {
        reject(new Error("Max retries reached without completion."))
      }
    }

    checkCompletion()
  })
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
  // @todo reorder:
  // INLET
  // CORE
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
