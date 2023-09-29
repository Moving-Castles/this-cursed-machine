import {
  EntityType,
  MachineType,
  ConnectionType,
} from "../../modules/state/enums"
import {
  simulated,
  simulatedConnections,
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
    const connectionsUsingPort = Object.values(
      get(simulatedConnections)
    ).filter(
      connection => connection.sourcePort === id || connection.targetPort === id
    )
    return connectionsUsingPort.length > 0
  })
  const freePorts = sourcePorts.filter(([id, _]) => {
    // if a connection exists with this as source OR target, list as occupied
    const connectionsUsingPort = Object.values(
      get(simulatedConnections)
    ).filter(
      connection => connection.sourcePort === id || connection.targetPort === id
    )
    return connectionsUsingPort.length === 0
  })

  return [occupiedPorts, freePorts]
}

// Build
export const buildMachine = (machineType: string, send: Function) => {
  // First add the potential transaction
  build(MachineType[machineType], 0, 0)
  send(`Building a ${machineType}`)
}

// Connect
export const connectMachines = (
  source: string,
  target: string,
  send: Function
) => {
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
      const connections = Object.values($simulated).filter(
        ent => ent.entityType === EntityType.CONNECTION
      )
      // Make sure there are ports we can connect
      const sourcePorts = Object.entries($simulated).filter(
        ([_, ent]) => ent?.carriedBy === sourceMachine[0]
      )
      const targetPorts = Object.entries($simulated).filter(
        ([_, ent]) => ent?.carriedBy === targetMachine[0]
      )

      const occupiedSourcePorts = sourcePorts.filter(([id, _]) => {
        // if a connection exists with this as source OR target, list as occupied
        const connectionsUsingPort = connections.filter(
          connection =>
            connection.sourcePort === id || connection.targetPort === id
        )
        return connectionsUsingPort.length > 0
      })
      const totalOccupiedSourcePorts = occupiedSourcePorts.length
      const totalAvailableSourcePorts =
        sourcePorts.length - totalOccupiedSourcePorts

      const occupiedTargetPorts = targetPorts.filter(([id, _]) => {
        // if a connection exists with this as source OR target, list as occupied
        const connectionsUsingPort = connections.filter(
          connection =>
            connection.sourcePort === id || connection.targetPort === id
        )
        return connectionsUsingPort.length > 0
      })
      const totalOccupiedTargetPorts = occupiedTargetPorts.length
      const totalAvailableTargetPorts =
        targetPorts.length - totalOccupiedTargetPorts

      if (totalAvailableSourcePorts > 0 && totalAvailableTargetPorts > 0) {
        // Connect the first available port
        connect(ConnectionType.RESOURCE, sourcePorts[0][0], targetPorts[0][0])
      } else {
        send("Ports occupied. Sawry")
      }
    }
  }
}
