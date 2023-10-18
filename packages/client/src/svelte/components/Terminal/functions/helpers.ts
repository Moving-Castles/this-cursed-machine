import { tick } from "svelte"
import type { Action } from "../../../modules/action/actionSequencer";
import { simulated } from "../../../modules/simulator";
import { get } from "svelte/store";
import { PortType, EntityType } from "../../../modules/state/enums";
import { connections } from "../../../modules/state";
import { SimulatedEntities } from "../../../modules/simulator/types";

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
 * @returns {Promise<Action>} - A promise that resolves with the action once its transaction is set, or rejects after a certain number of retries.
 */
export const waitForTransaction = (action: Action): Promise<Action> => {
    return new Promise((resolve, reject) => {
        const maxRetries = 100;
        let attempts = 0;

        const checkTransaction = () => {
            if (action.tx) { // check if tx is set (i.e., it has a truthy value)
                resolve(action);
            } else if (attempts < maxRetries) {
                attempts++;
                // wait for some time before checking again
                setTimeout(checkTransaction, 100);
            } else {
                reject(new Error('Max retries reached without transaction.'));
            }
        };

        checkTransaction();
    });
};

/**
 * Waits for the specified action to be completed.
 *
 * @function waitForCompletion
 * @param {Action} action - The action object to check for completion.
 * @returns {Promise<Action>} - A promise that resolves with the action once it's completed, or rejects after a certain number of retries.
 */
export const waitForCompletion = (action: Action): Promise<Action> => {
    return new Promise((resolve, reject) => {
        const maxRetries = 100; // just an example, set to however many retries you want
        let attempts = 0;

        const checkCompletion = () => {
            console.log('top', action)
            if (action.completed) {
                resolve(action);
            } else if (action.failed) {
                console.log('failed', action)
                reject(new Error('Action failed.'))
            } else if (attempts < maxRetries) {
                attempts++;
                // wait for some time before checking again
                setTimeout(checkCompletion, 100); // checking every second in this example
            } else {
                reject(new Error('Max retries reached without completion.'));
            }
        };

        checkCompletion();
    });
};

/**
 * Retrieves available ports for a given machine based on an optional port type.
 * @param {string} machineId - The ID of the machine.
 * @param {PortType} [portType] - A port type to filter by.
 * @returns {Array} An array of available ports.
 */
export const getMachinePorts = (machineId: string, portType: PortType): any[] => {
    // Get machine entity
    const machine = Object.entries(get(simulated)).find(
        ([key, _]) => key === machineId
    )

    // Abort of machine does not exist
    if (!machine) return []

    // Retrieve ports based on the source machine and optionally filter by portType
    const ports = Object.entries(get(simulated)).filter(
        ([_, entity]) => entity?.carriedBy === machine[0] && entity.portType === portType
    )

    const isPortOccupied = (id: string) => {
        const connectionsUsingPort = Object.values(get(connections)).filter(
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

    // Get all machines
    const allMachines = Object.fromEntries(
        Object.entries(get(simulated)).filter(
            ([, entity]) => entity.entityType === EntityType.MACHINE
        )
    )

    console.log('allMachines', allMachines)

    // For each machine...
    for (let [machineKey, machine] of Object.entries(allMachines)) {
        // Get all ports of type
        const portsOnMachine = Object.fromEntries(
            Object.entries(get(simulated)).filter(
                ([, entity]) => entity.entityType === EntityType.PORT && entity.carriedBy === machineKey && entity.portType === portType
            )
        )

        console.log('portsOnMachine', portsOnMachine)

        let occupiedPorts = 0

        // For each port ...
        for (let portKey of Object.keys(portsOnMachine)) {
            // Check if there is  connection going to or from that port
            let connectionToPort = Object.values(get(simulated)).filter(
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
