import {
  EntityType,
  MachineType,
} from "../../modules/state/enums"
import { connections } from "../../modules/state"
import {
  simulated,
  // simulatedConnections,
  simulatedMachines,
  simulatedPorts,
} from "../../modules/simulator"
import { get } from "svelte/store"
import { build, connect } from "../../modules/action"

export const availablePorts = (machineId: string) => {
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
  const freePorts = sourcePorts.filter(([id, _]) => {
    // if a connection exists with this as source OR target, list as occupied
    const connectionsUsingPort = Object.values(get(connections)).filter(
      connection => connection.sourcePort === id || connection.targetPort === id
    )
    return connectionsUsingPort.length === 0
  })

  return [occupiedPorts, freePorts]
}

// Build
export const buildMachine = (machineType: string, send: Function) => {
  // First add the potential transaction
  const action = build(MachineType[machineType], 0, 0)
  send(`Building a ${machineType}`)

  // Wait for the result of the action
  return action
}

// Connect
export const connectMachines = (
  source: string,
  target: string,
  send: Function
) => {
  let action = null

  const $simulated = get(simulated)

  const sourceMachine = Object.entries($simulated).find(
    ([_, ent]) => ent.numericalID === source
  )
  const targetMachine = Object.entries($simulated).find(
    ([_, ent]) => ent.numericalID === target
  )
  if (sourceMachine && targetMachine) {
    if (
      sourceMachine[1].entityType !== EntityType.MACHINE ||
      targetMachine[1].entityType !== EntityType.MACHINE
    ) {
      send("Please, only connect machines")
    } else {
      const [_, sourcePorts] = availablePorts(sourceMachine[1].numericalID)
      const [__, targetPorts] = availablePorts(targetMachine[1].numericalID)

      if (sourcePorts.length > 0 && targetPorts.length > 0) {
        // Connect the first available port
        action = connect(
          sourcePorts[0][0],
          targetPorts[0][0]
        )
      } else {
        send("Ports occupied. Sawry")
      }
    }
  }
  return action
}
