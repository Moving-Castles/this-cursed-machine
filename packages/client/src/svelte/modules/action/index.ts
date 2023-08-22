import { ConnectionType, MachineType, Rotation } from "../state/enums";
import { addToSequencer } from "./actionSequencer";

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

export function spawn(name: string) {
    addToSequencer(WorldFunctions.Spawn, [name])
}

export function transfer() {
    addToSequencer(WorldFunctions.Transfer, [])
}

export function connect(connectionType: ConnectionType, sourcePort: string, targetPort: string) {
    addToSequencer(WorldFunctions.Connect, [connectionType, sourcePort, targetPort])
}

export function disconnect(connectionEntity: string) {
    addToSequencer(WorldFunctions.Disconnect, [connectionEntity])
}

export function build(machineType: MachineType, x: number, y: number, rotation: Rotation) {
    addToSequencer(WorldFunctions.Build, [machineType, x, y, rotation])
}

export function rotate(entity: string, rotation: Rotation) {
    addToSequencer(WorldFunctions.Rotate, [entity, rotation])
}

export function resolve() {
    addToSequencer(WorldFunctions.Resolve, [])
}