import { get } from "svelte/store"
import { simulatedMachines, simulatedPorts } from "../simulator"
import { connections } from "./index"

/**
 * get the currently occupied and free ports for given machine
 * @param machineId
 * @returns [occupiedPorts, availablePorts]
 */
export const machinePorts = (machineId: string) => {
  const sourceMachine = Object.entries(get(simulatedMachines)).find(
    ([_, ent]) => ent.numericalID === machineId
  )
  const sourcePorts = Object.entries(get(simulatedPorts)).filter(
    ([_, ent]) => ent?.carriedBy === sourceMachine[0]
  )
  const occupiedPorts = sourcePorts.filter(([id, _]) => {
    // if a connection exists with this as source OR target, list as occupied
    const connectionsUsingPort = Object.values(get(connections)).filter(
      connection => connection.sourcePort === id || connection.targetPort === id
    )
    return connectionsUsingPort.length > 0
  })
  const availablePorts = sourcePorts.filter(([id, _]) => {
    // if a connection exists with this as source OR target, list as occupied
    const connectionsUsingPort = Object.values(get(connections)).filter(
      connection => connection.sourcePort === id || connection.targetPort === id
    )
    return connectionsUsingPort.length === 0
  })

  return [occupiedPorts, availablePorts]
}
