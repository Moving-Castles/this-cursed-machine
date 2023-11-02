import { get } from "svelte/store"
import {
  simulatedMachines,
  simulatedConnections,
  simulatedPorts,
} from "../simulator"
import { connections } from "./index"
import { ConnectionState } from "../state/enums"
import { MachineType, PortType } from "./types"

/**
 * Get the machine this connection runs from
 * @param connectionId
 * @returns
 */
export const connectionSourceMachine = (
  connectionId: string,
  type: "address" | "entity" | "entry" = "entity"
) => {
  const address =
    get(simulatedPorts)[get(connections)[connectionId].sourcePort]?.carriedBy
  if (type === "address") return address
  const entity = get(simulatedMachines)[address]
  if (type === "entity") return entity
  // entry format
  return [address, entity]
}

/**
 * Get the machine this connection targets
 * @param connectionId
 * @param type "entry" | "address" | "both" = "entry"
 * @returns address, entity or entry based on your preference. Default is entry
 */
export const connectionTargetMachine = (
  connectionId: string,
  type: "address" | "entity" | "entry" = "entity"
) => {
  const address =
    get(simulatedPorts)[get(connections)[connectionId].targetPort]?.carriedBy
  if (type === "address") return address
  const entity = get(simulatedMachines)[address]
  if (type === "entity") return entity
  // Entry format
  return [address, entity]
}

/**
 * Get the machine that this port connects to,
 * NOTE: This is NOT the machine this port is carried by, but the machine the port connects to through the connection

 * @param portId 
 * @returns 
 */
export const portConnectionOppositeMachine = (portId: string) => {
  const port = get(simulatedPorts)[portId]
  const connection = Object.entries(get(connections)).find(([_, conn]) => {
    return conn.sourcePort === portId || conn.targetPort === portId
  })

  if (connection) {
    if (port.portType === PortType.OUTPUT)
      return connectionSourceMachine(connection[0], "entry")
    if (port.portType === PortType.INPUT)
      return connectionTargetMachine(connection[0], "entry")
  }

  return false
}

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

const dfs = (
  currentMachineUID: string,
  visited: Set<string>,
  machinesMap: Map<string, Machine>,
  portsMap: Map<string, Port>,
  connections: Connection[]
): Set<string> => {
  if (visited.has(currentMachineUID)) return new Set()
  visited.add(currentMachineUID)

  const currentMachine = machinesMap.get(currentMachineUID)
  const flowingConnections = new Set<string>()

  if (currentMachine!.machineType === MachineType.OUTLET) {
    return flowingConnections
  }

  for (const connection of connections) {
    let nextPortUID: string | null = null
    if (portsMap.get(connection.sourcePort)!.carriedBy === currentMachineUID) {
      nextPortUID = connection.targetPort
    }

    if (nextPortUID) {
      const nextMachineUID = portsMap.get(nextPortUID)!.carriedBy
      const subFlowingConnections = dfs(
        nextMachineUID,
        visited,
        machinesMap,
        portsMap,
        connections
      )
      if (
        subFlowingConnections.size > 0 ||
        machinesMap.get(nextMachineUID)!.machineType === MachineType.OUTLET
      ) {
        flowingConnections.add(
          connection.sourcePort + "->" + connection.targetPort
        )
        for (const conn of subFlowingConnections) {
          flowingConnections.add(conn)
        }
      }
    }
  }

  return flowingConnections
}

const dfsFlowingEntities = (
  currentMachineUID: string,
  visited: Set<string>,
  machinesMap: Map<string, Machine>,
  portsMap: Map<string, Port>,
  connections: Connection[]
): { flowingMachines: Set<string>; flowingConnections: Set<string> } => {
  if (visited.has(currentMachineUID))
    return { flowingMachines: new Set(), flowingConnections: new Set() }
  visited.add(currentMachineUID)

  const currentMachine = machinesMap.get(currentMachineUID)
  let flowingMachines = new Set<string>()
  let flowingConnections = new Set<string>()

  if (currentMachine!.machineType === MachineType.OUTLET) {
    flowingMachines.add(currentMachineUID)
    return { flowingMachines, flowingConnections }
  }

  for (const connection of connections) {
    let nextPortUID: string | null = null
    if (portsMap.get(connection.sourcePort)!.carriedBy === currentMachineUID) {
      nextPortUID = connection.targetPort
    }

    if (nextPortUID) {
      const nextMachineUID = portsMap.get(nextPortUID)!.carriedBy
      const {
        flowingMachines: nextFlowingMachines,
        flowingConnections: nextFlowingConnections,
      } = dfsFlowingEntities(
        nextMachineUID,
        visited,
        machinesMap,
        portsMap,
        connections
      )

      if (
        nextFlowingMachines.size > 0 ||
        machinesMap.get(nextMachineUID)!.machineType === MachineType.OUTLET
      ) {
        flowingConnections.add(
          connection.sourcePort + "->" + connection.targetPort
        )
        flowingMachines.add(currentMachineUID)

        for (const conn of nextFlowingConnections) {
          flowingConnections.add(conn)
        }
        for (const machine of nextFlowingMachines) {
          flowingMachines.add(machine)
        }
      }
    }
  }

  return { flowingMachines, flowingConnections }
}

const getFlowingEntities = (
  machinesEntries: [string, Machine][],
  portsEntries: [string, Port][],
  allConnections: Connection[]
): { flowingMachines: Set<string>; flowingConnections: Set<string> } => {
  const machinesMap = new Map<string, Machine>(machinesEntries)
  const portsMap = new Map<string, Port>(portsEntries)
  const visited = new Set<string>()

  let flowingMachines = new Set<string>()
  let flowingConnections = new Set<string>()

  for (const [machineUID, machine] of machinesMap) {
    if (machine.machineType === MachineType.INLET && !visited.has(machineUID)) {
      const {
        flowingMachines: nextFlowingMachines,
        flowingConnections: nextFlowingConnections,
      } = dfsFlowingEntities(
        machineUID,
        visited,
        machinesMap,
        portsMap,
        allConnections
      )

      for (const conn of nextFlowingConnections) {
        flowingConnections.add(conn)
      }
      for (const machine of nextFlowingMachines) {
        flowingMachines.add(machine)
      }
    }
  }

  return { flowingMachines, flowingConnections }
}

const determineMachineState = (
  machineUID: string,
  machinesEntries: [string, Machine][],
  portsEntries: [string, Port][],
  allConnections: Connection[]
): ConnectionState => {
  const { flowingMachines } = getFlowingEntities(
    machinesEntries,
    portsEntries,
    allConnections
  )

  if (flowingMachines.has(machineUID)) {
    return ConnectionState.FLOWING
  } else {
    const portsOfMachine = Array.from(portsEntries)
      .filter(([, port]) => port.carriedBy === machineUID)
      .map(([uid]) => uid)

    const isConnected = allConnections.some(
      connection =>
        portsOfMachine.includes(connection.sourcePort) ||
        portsOfMachine.includes(connection.targetPort)
    )

    return isConnected ? ConnectionState.CONNECTED : ConnectionState.NONE
  }
}

const determineConnectionState = (
  connection: Connection,
  machinesEntries: [string, Machine][],
  portsEntries: [string, Port][],
  allConnections: Connection[]
): ConnectionState => {
  const { flowingConnections } = getFlowingEntities(
    machinesEntries,
    portsEntries,
    allConnections
  )
  return flowingConnections.has(
    connection.sourcePort + "->" + connection.targetPort
  )
    ? ConnectionState.FLOWING
    : ConnectionState.CONNECTED
}

export const connectionState = (connection: Connection) => {
  return determineConnectionState(
    connection,
    Object.entries(get(simulatedMachines)),
    Object.entries(get(simulatedPorts)),
    Object.values(get(simulatedConnections))
  )
}

export const machineState = (machineId: string) => {
  return determineMachineState(
    machineId,
    Object.entries(get(simulatedMachines)),
    Object.entries(get(simulatedPorts)),
    Object.values(get(simulatedConnections))
  )
}

/**
 * Converts a MachineType enum value to a corresponding string label.
 * @param {MachineType} machineType - The machine type to convert.
 * @returns {string} The string label corresponding to the provided machine type.
 */
export function machineTypeToLabel(machineType: MachineType | undefined) {
  switch (machineType || MachineType.NONE) {
    case MachineType.INLET:
      return "FOOD DISPENSER"
    case MachineType.OUTLET:
      return "WAREHOUSE"
    case MachineType.CORE:
      return "YOU"
    default:
      return MachineType[machineType]
  }
}