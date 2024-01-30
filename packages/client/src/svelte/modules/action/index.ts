import { MachineType, PortIndex } from "../state/enums"
import { addToSequencer } from "./actionSequencer"

export enum WorldFunctions {
  Spawn = "spawn",
  Start = "start",
  Connect = "connect",
  Disconnect = "disconnect",
  Build = "build",
  Destroy = "destroy",
  Resolve = "resolve",
  Name = "name",
  ConnectStorage = "connectStorage",
  DisconnectStorage = "disconnectStorage",
  ClearStorage = "clearStorage",
  Fill = "fill",
  Accept = "accept"
}

// --- API --------------------------------------------------------------

export function spawn() {
  return addToSequencer(WorldFunctions.Spawn, [])
}

export function start() {
  return addToSequencer(WorldFunctions.Start, [])
}

export function connect(
  sourceMachine: string,
  targetMachine: string,
  portIndex: PortIndex
) {
  return addToSequencer(WorldFunctions.Connect, [
    sourceMachine,
    targetMachine,
    portIndex
  ])
}

export function disconnect(sourceMachine: string, portIndex: PortIndex) {
  return addToSequencer(WorldFunctions.Disconnect, [sourceMachine, portIndex])
}

export function build(machineType: MachineType) {
  return addToSequencer(WorldFunctions.Build, [machineType])
}

export function destroy(machineEntity: string) {
  return addToSequencer(WorldFunctions.Destroy, [machineEntity])
}

export function resolve() {
  return addToSequencer(WorldFunctions.Resolve, [])
}

export function name(name: string) {
  return addToSequencer(WorldFunctions.Name, [name])
}

export function connectStorage(storageEntity: string, machineType: MachineType.INLET | MachineType.OUTLET) {
  return addToSequencer(WorldFunctions.ConnectStorage, [
    storageEntity,
    machineType
  ])
}

export function disconnectStorage(machineType: MachineType.INLET | MachineType.OUTLET) {
  return addToSequencer(WorldFunctions.DisconnectStorage, [machineType])
}

export function clearStorage(storageEntity: string) {
  return addToSequencer(WorldFunctions.ClearStorage, [storageEntity])
}

export function fill(storageEntity: string) {
  return addToSequencer(WorldFunctions.Fill, [storageEntity])
}