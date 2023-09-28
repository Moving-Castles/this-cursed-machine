import { ConnectionType, MachineType } from "../state/enums";
import { addToSequencer } from "./actionSequencer";

// export enum WorldFunctions {
//     Spawn = "mc_SpawnSystem_spawn",
//     Transfer = "mc_TransferSystem_transfer",
//     Connect = "mc_ConnectionSystem_connect",
//     Disconnect = "mc_ConnectionSystem_disconnect",
//     Build = "mc_BuildSystem_build",
//     Resolve = "mc_ResolveSystem_resolve",
// }

export enum WorldFunctions {
    Spawn = "spawn",
    Transfer = "transfer",
    Connect = "connect",
    Disconnect = "disconnect",
    Build = "build",
    Resolve = "resolve",
}

// --- API --------------------------------------------------------------

export function spawn() {
    addToSequencer(WorldFunctions.Spawn, [])
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

export function build(machineType: MachineType, x: number, y: number) {
    addToSequencer(WorldFunctions.Build, [machineType, x, y])
}

export function resolve() {
    addToSequencer(WorldFunctions.Resolve, [])
}