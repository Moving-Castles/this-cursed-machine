import { MachineType } from "../state/enums"
import { addToSequencer } from "./actionSequencer"

export enum WorldFunctions {
  Spawn = "spawn",
  Transfer = "transfer",
  Connect = "connect",
  Disconnect = "disconnect",
  Build = "build",
  Destroy = "destroy",
  Resolve = "resolve",
}

// --- API --------------------------------------------------------------

export function spawn() {
  return addToSequencer(WorldFunctions.Spawn, [])
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
