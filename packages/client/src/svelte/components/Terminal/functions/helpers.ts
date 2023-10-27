import { tick } from "svelte"
import type { Action } from "../../../modules/action/actionSequencer";
import { simulatedConnections, simulatedMachines, simulatedPorts } from "../../../modules/simulator";
import { get } from "svelte/store";
import { PortType } from "../../../modules/state/enums";
import { SimulatedEntities } from "../../../modules/simulator/types";
import { COMMAND, TerminalType } from "../types"
import { SPAWN_COMMANDS, FULL_COMMANDS, terminalOutput } from ".."

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
export const waitForTransaction = (action: Action, loadingFunction?: (index: number) => {}): Promise<Action> => {
  return new Promise((resolve, reject) => {
    const maxRetries = 100
    let attempts = 0
    let index = 0

    const checkTransaction = () => {
      index++;
      if (loadingFunction) loadingFunction(index);
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
export const waitForCompletion = (action: Action, loadingFunction?: (index: number) => {}): Promise<Action> => {
  return new Promise((resolve, reject) => {
    const maxRetries = 100 // just an example, set to however many retries you want
    let attempts = 0
    let index = 0

    const checkCompletion = () => {
      index++;
      if (loadingFunction) loadingFunction(index);
      if (action.completed) {
        resolve(action)
      } else if (action.failed) {
        console.log("failed", action)
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

/**
 * Retrieves available ports for a given machine based on an optional port type.
 * @param {string} machineId - The ID of the machine.
 * @param {PortType} [portType] - A port type to filter by.
 * @returns {Array} An array of available ports.
 */
export const getMachinePorts = (machineId: string, portType: PortType): any[] => {
  // Get machine entity
  const machine = Object.entries(get(simulatedMachines)).find(
    ([key, _]) => key === machineId
  )

  if (!machine) return [];

  // Retrieve ports based on the source machine and filter by portType
  const ports = Object.entries(get(simulatedPorts)).filter(
    ([_, entity]) => entity?.carriedBy === machine[0] && entity.portType === portType
  )

  const isPortOccupied = (id: string) => {
    const connectionsUsingPort = Object.values(get(simulatedConnections)).filter(
      connection => connection.sourcePort === id || connection.targetPort === id
    )
    return connectionsUsingPort.length > 0;
  }

  const availablePorts = ports.filter(([id, _]) => !isPortOccupied(id));

  return availablePorts;
}

/**
 * Gets machines that have available ports of a specified type.
 * @param {PortType} portType - The type of port to look for (e.g., 'input', 'output').
 * @returns {SimulatedEntities} An object containing machines with available ports of the specified type.
 */
export function getMachinesWithAvailablePorts(portType: PortType) {
  let availableMachines: SimulatedEntities = {}

  // For each machine...
  for (let [machineKey, machine] of Object.entries(get(simulatedMachines))) {
    // Get all ports of type
    const portsOnMachine = Object.fromEntries(
      Object.entries(get(simulatedPorts)).filter(
        ([, entity]) => entity.carriedBy === machineKey && entity.portType === portType
      )
    )

    console.log('portsOnMachine', portsOnMachine)

    let occupiedPorts = 0

    // For each port ...
    for (let portKey of Object.keys(portsOnMachine)) {
      // Check if there is  connection going to or from that port
      let connectionToPort = Object.values(get(simulatedConnections)).filter(
        (entity) => entity.sourcePort === portKey || entity.targetPort === portKey
      )
      // Connection(s) found
      if (connectionToPort.length > 0) {
        occupiedPorts++
      }
    }

    // If the ports are not fully occupied, add the machine to the list
    if (occupiedPorts < Object.values(portsOnMachine).length) {
      availableMachines[machineKey] = machine
    }
  }

  // Finally, return available machines
  return availableMachines
}

/**
 * Filters a command based on the terminal type.
 * 
 * @param {TerminalType} terminalType - The type of the terminal.
 * @param {COMMAND} commandId - The ID of the command.
 * @returns {boolean} Returns true if the command is valid for the given terminal type, otherwise false.
 */
export function terminalTypeCommandFilter(terminalType: TerminalType, commandId: COMMAND): boolean {
  if (terminalType === TerminalType.SPAWN) {
    return SPAWN_COMMANDS.includes(commandId) ? true : false;
  } else {
    return FULL_COMMANDS.includes(commandId) ? true : false;
  }
}

/**
 * Display a full-screen flash effect that lasts for 100ms.
 * 
 * @returns {Promise<void>} Resolves once the flash effect completes.
 */
export async function flashEffect(): Promise<void> {
  return new Promise(resolve => {
    // Create a new div element
    const flashDiv = document.createElement('div');

    // Assign the 'flash-effect' class to it
    flashDiv.className = 'flash';

    // Append it to the body
    document.body.appendChild(flashDiv);

    // Remove the div after 100ms and resolve the promise
    setTimeout(() => {
      document.body.removeChild(flashDiv);
      resolve();
    }, 50);
  });
}

export function clearTerminalOutput() {
  terminalOutput.set([])
}

