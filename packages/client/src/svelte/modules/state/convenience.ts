import type { SimulatedEntity } from "../simulator/types"

import { get } from "svelte/store"
import { simulatedMachines } from "../simulator"

import { EMPTY_CONNECTION } from "../state"
import { ConnectionState, MaterialType, PortIndex } from "../state/enums"
import { MachineType } from "./types"
import { DIRECTION } from "../../components/Terminal/types"

/**
 *
 * @param direction
 * @returns Machine[]
 */
export const availableMachines = (direction: DIRECTION) => {
  const machines = Object.entries(get(simulatedMachines))

  return machines.filter(([_, machine]) => {
    return (
      machine[
        direction === DIRECTION.OUTGOING
          ? "outgoingConnections"
          : "incomingConnections"
      ].filter(connection => connection === EMPTY_CONNECTION).length > 0
    )
  })
}

/**
 *
 * @param direction
 * @returns PortDefinition
 */
export const availablePorts = (machine: Machine, direction: DIRECTION) => {
  return machine[
    direction === DIRECTION.OUTGOING
      ? "outgoingConnections"
      : "incomingConnections"
  ]
    .map((address, i) => ({
      portIndex: i,
      machine,
      address,
    }))
    .filter(connection => connection.address === EMPTY_CONNECTION)
    .flat()
}

const dfs = (
  currentMachineUID: string,
  visited: Set<string>,
  machinesMap: Map<string, Machine>
): Set<string> => {
  return []
  // if (visited.has(currentMachineUID)) return new Set()
  // visited.add(currentMachineUID)

  // const currentMachine = machinesMap.get(currentMachineUID)
  // const flowingConnections = new Set<string>()

  // if (currentMachine!.machineType === MachineType.OUTLET) {
  //   return flowingConnections
  // }

  // for (const connection of connections) {
  //   let nextPortUID: string | null = null
  //   if (portsMap.get(connection.sourcePort)!.carriedBy === currentMachineUID) {
  //     nextPortUID = connection.targetPort
  //   }

  //   if (nextPortUID) {
  //     const nextMachineUID = portsMap.get(nextPortUID)!.carriedBy
  //     const subFlowingConnections = dfs(
  //       nextMachineUID,
  //       visited,
  //       machinesMap,
  //       portsMap,
  //       connections
  //     )
  //     if (
  //       subFlowingConnections.size > 0 ||
  //       machinesMap.get(nextMachineUID)!.machineType === MachineType.OUTLET
  //     ) {
  //       flowingConnections.add(
  //         connection.sourcePort + "->" + connection.targetPort
  //       )
  //       for (const conn of subFlowingConnections) {
  //         flowingConnections.add(conn)
  //       }
  //     }
  //   }
  // }

  // return flowingConnections
}

const dfsFlowingEntities = (
  currentMachineUID: string,
  visited: Set<string>,
  machinesMap: Map<string, Machine>,
  connections: Connection[]
): { flowingMachines: Set<string>; flowingConnections: Set<string> } => {
  return { flowingMachines: new Set(), flowingConnections: new Set() }
  // if (visited.has(currentMachineUID))
  //   return { flowingMachines: new Set(), flowingConnections: new Set() }
  // visited.add(currentMachineUID)

  // const currentMachine = machinesMap.get(currentMachineUID)
  // let flowingMachines = new Set<string>()
  // let flowingConnections = new Set<string>()

  // if (currentMachine!.machineType === MachineType.OUTLET) {
  //   flowingMachines.add(currentMachineUID)
  //   return { flowingMachines, flowingConnections }
  // }

  // for (const connection of connections) {
  //   let nextPortUID: string | null = null
  //   if (portsMap.get(connection.sourcePort)!.carriedBy === currentMachineUID) {
  //     nextPortUID = connection.targetPort
  //   }

  //   if (nextPortUID) {
  //     const nextMachineUID = portsMap.get(nextPortUID)!.carriedBy
  //     const {
  //       flowingMachines: nextFlowingMachines,
  //       flowingConnections: nextFlowingConnections,
  //     } = dfsFlowingEntities(
  //       nextMachineUID,
  //       visited,
  //       machinesMap,
  //       portsMap,
  //       connections
  //     )

  //     if (
  //       nextFlowingMachines.size > 0 ||
  //       machinesMap.get(nextMachineUID)!.machineType === MachineType.OUTLET
  //     ) {
  //       flowingConnections.add(
  //         connection.sourcePort + "->" + connection.targetPort
  //       )
  //       flowingMachines.add(currentMachineUID)

  //       for (const conn of nextFlowingConnections) {
  //         flowingConnections.add(conn)
  //       }
  //       for (const machine of nextFlowingMachines) {
  //         flowingMachines.add(machine)
  //       }
  //     }
  //   }
  // }

  // return { flowingMachines, flowingConnections }
}

const getFlowingEntities = (
  machinesEntries: [string, Machine][],
  allConnections: Connection[]
): { flowingMachines: Set<string>; flowingConnections: Set<string> } => {
  let flowingMachines = new Set<string>()
  let flowingConnections = new Set<string>()

  return { flowingMachines, flowingConnections }
  // const machinesMap = new Map<string, Machine>(machinesEntries)
  // const portsMap = new Map<string, Port>(portsEntries)
  // const visited = new Set<string>()

  // let flowingMachines = new Set<string>()
  // let flowingConnections = new Set<string>()

  // for (const [machineUID, machine] of machinesMap) {
  //   if (machine.machineType === MachineType.INLET && !visited.has(machineUID)) {
  //     const {
  //       flowingMachines: nextFlowingMachines,
  //       flowingConnections: nextFlowingConnections,
  //     } = dfsFlowingEntities(
  //       machineUID,
  //       visited,
  //       machinesMap,
  //       portsMap,
  //       allConnections
  //     )

  //     for (const conn of nextFlowingConnections) {
  //       flowingConnections.add(conn)
  //     }
  //     for (const machine of nextFlowingMachines) {
  //       flowingMachines.add(machine)
  //     }
  //   }
  // }

  // return { flowingMachines, flowingConnections }
}

const determineMachineState = (
  machineUID: string,
  machinesEntries: [string, Machine][],
  allConnections: Connection[]
): ConnectionState => {
  const { flowingMachines } = getFlowingEntities(
    machinesEntries,
    allConnections
  )

  if (flowingMachines.has(machineUID)) {
    return ConnectionState.FLOWING
  } else {
    return ConnectionState.NONE
    // const portsOfMachine = Array.from(portsEntries)
    //   .filter(([, port]) => port.carriedBy === machineUID)
    //   .map(([uid]) => uid)

    // const isConnected = allConnections.some(
    //   connection =>
    //     portsOfMachine.includes(connection.sourcePort) ||
    //     portsOfMachine.includes(connection.targetPort)
    // )

    // return isConnected ? ConnectionState.CONNECTED : ConnectionState.NONE
  }
}

const determineConnectionState = (
  connection: Connection,
  machinesEntries: [string, Machine][],
  allConnections: Connection[]
): ConnectionState => {
  const { flowingConnections } = getFlowingEntities(
    machinesEntries,
    allConnections
  )
  return flowingConnections.has(
    connection.sourcePort + "->" + connection.targetPort
  )
    ? ConnectionState.FLOWING
    : ConnectionState.CONNECTED
}

export const connectionState = (connection: Connection) => {
  return ConnectionState.NONE
  return determineConnectionState(
    connection,
    Object.entries(get(simulatedMachines)),
    Object.entries(get(simulatedPorts)),
    Object.values(get(simulatedConnections))
  )
}

export const machineState = (machineId: string) => {
  return ConnectionState.NONE
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
      return "BUG DISPENSER"
    case MachineType.OUTLET:
      return "WAREHOUSE"
    case MachineType.CORE:
      return "YOU"
    default:
      return MachineType[machineType]
  }
}

export const materialTypeToLabel = (materialType: MaterialType) => {
  return MaterialType[materialType]?.split("_")?.join(" ")
}
