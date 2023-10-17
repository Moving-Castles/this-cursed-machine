import { get } from "svelte/store"
import { simulatedMachines, simulatedPorts } from "../simulator"
import { connections } from "./index"
import { PortType } from "./types"

/**
 * Get the occupied and available ports for a machine.
 *
 * @param {string} machineId - The ID of the machine.
 * @param {PortType} [portType] - The optional type of port (INPUT/OUTPUT) to filter by.
 * @returns {[any[], any[]]} - A tuple containing occupied ports and available ports.
 */
export const machinePorts = (machineId: string, portType?: PortType) => {
  const sourceMachine = Object.entries(get(simulatedMachines)).find(
    ([id, _]) => id === machineId
  )

  // Check if source machine exists
  if (!sourceMachine) return [[], []]

  // Retrieve ports based on the source machine and optionally filter by portType
  const sourcePorts = Object.entries(get(simulatedPorts)).filter(
    ([_, ent]) =>
      ent?.carriedBy === sourceMachine[0] &&
      (portType === undefined || ent.portType === portType)
  )

  const isPortOccupied = (id: string) => {
    const connectionsUsingPort = Object.values(get(connections)).filter(
      connection => connection.sourcePort === id || connection.targetPort === id
    )
    return connectionsUsingPort.length > 0
  }

  const occupiedPorts = sourcePorts.filter(([id, _]) => isPortOccupied(id))
  const availablePorts = sourcePorts.filter(([id, _]) => !isPortOccupied(id))

  return [occupiedPorts, availablePorts]
}

/**
 * Check if the port belongs to this box
 *
 * @param port Port
 * @param boxAddress address
 * @returns
 */
export const portBelongsToBox = (port: Port, boxAddress: string) => {
  // Checks if the source port is on a machine that is in that box
  const machines = get(simulatedMachines)

  const sourceMachine = machines[port?.carriedBy]
  return sourceMachine?.carriedBy === boxAddress
}

/**
 * Check if the connection belongs to this box
 *
 * @param connection Connection
 * @param boxAddress address
 * @returns
 */
export const connectionBelongsToBox = (
  connection: Connection,
  boxAddress: string
) => {
  // Checks if the source port is on a machine that is in that box
  const ports = get(simulatedPorts)
  const machines = get(simulatedMachines)

  const sourcePort = ports[connection.sourcePort]

  if (sourcePort) {
    const sourceMachine = machines[sourcePort?.carriedBy]
    return sourceMachine?.carriedBy === boxAddress
  }

  return false
}
