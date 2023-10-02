import { ConnectionType, MachineType, Rotation } from "../state/enums"
import { addToSequencer } from "./actionSequencer"

// export enum WorldFunctions {
//     Spawn = "mc_SpawnSystem_spawn",
//     Transfer = "mc_TransferSystem_transfer",
//     Connect = "mc_ConnectionSystem_connect",
//     Disconnect = "mc_ConnectionSystem_disconnect",
//     Build = "mc_BuildSystem_build",
//     Resolve = "mc_ResolveSystem_resolve",
// }

export enum WorldFunctions {
  Spawn = "mc_SpawnSystem_spawn",
  Transfer = "mc_TransferSystem_transfer",
  Connect = "mc_ConnectionSystem_connect",
  Disconnect = "mc_ConnectionSystem_disconnect",
  Build = "mc_BuildSystem_build",
  Rotate = "mc_RotationSystem_rotate",
  Resolve = "mc_ResolveSystem_resolve",
}

// --- API --------------------------------------------------------------

export function spawn() {
  return addToSequencer(WorldFunctions.Spawn, [])
}

export function transfer() {
  return addToSequencer(WorldFunctions.Transfer, [])
}

export function connect(
  connectionType: ConnectionType,
  sourcePort: string,
  targetPort: string
) {
  return addToSequencer(WorldFunctions.Connect, [
    connectionType,
    sourcePort,
    targetPort,
  ])
}

export function disconnect(connectionEntity: string) {
  return addToSequencer(WorldFunctions.Disconnect, [connectionEntity])
}

export function build(machineType: MachineType, x: number, y: number) {
  return addToSequencer(WorldFunctions.Build, [machineType, x, y])
}

export function rotate(entity: string, rotation: Rotation) {
  return addToSequencer(WorldFunctions.Rotate, [entity, rotation])
}

export function resolve() {
  return addToSequencer(WorldFunctions.Resolve, [])
}
