import { MachineType } from "../state/enums"
import { addToSequencer } from "./actionSequencer"

export enum WorldFunctions {
  Spawn = "spawn",
  Restart = "restart",
  Transfer = "transfer",
  Connect = "connect",
  Disconnect = "disconnect",
  Build = "build",
  Destroy = "destroy",
  Resolve = "resolve",
  Name = "name",
}

// --- API --------------------------------------------------------------

export function spawn() {
  return addToSequencer(WorldFunctions.Spawn, [])
}

export function restart() {
  return addToSequencer(WorldFunctions.Restart, [])
}

export function transfer() {
  return addToSequencer(WorldFunctions.Transfer, [])
}

export function connect(
  sourcePort: string,
  targetPort: string
) {
  return addToSequencer(WorldFunctions.Connect, [
    sourcePort,
    targetPort,
  ])
}

export function disconnect(connectionEntity: string) {
  return addToSequencer(WorldFunctions.Disconnect, [connectionEntity])
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