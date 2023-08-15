import { ConnectionType, MachineType } from "../state/types";
import { addToSequencer } from "./actionSequencer";

export enum WorldFunctions {
    Spawn = "mc_SpawnSystem_spawn",
    Transfer = "mc_TransferSystem_transfer",
    Connect = "mc_ConnectionSystem_connect",
    Disconnect = "mc_ConnectionSystem_disconnect",
    Build = "mc_BuildSystem_build"
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

export function build(machineType: MachineType, x: number, y: number) {
    addToSequencer(WorldFunctions.Build, [machineType, x, y])
}