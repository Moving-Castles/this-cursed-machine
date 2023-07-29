import type { ConnectionType } from "../state/types";
import { addToSequencer } from "./actionSequencer";

export enum WorldFunctions {
    Spawn = "mc_SpawnSystem_spawn",
    Connect = "mc_ConnectSystem_connect",
    Disconnect = "mc_ConnectSystem_disconnect",
    ChargeClaw = "mc_ClawSystem_charge",
    ChargePortal = "mc_PortalSystem_charge",
    Move = "mc_ClawSystem_move",
    Exit = "mc_PortalSystem_exit",
    Settle = "mc_ConnectSystem_settle",
    ConnectResourceSplit = "mc_RSplitSystem_connect",
    DisconnectResourceSplit = "mc_RSplitSystem_disconnect",
    ConnectControlSplit = "mc_CSplitSystem_connect",
    DisconnectControlSplit = "mc_CSplitSystem_disconnect",
    Vote = "mc_CSplitSystem_vote",
    ConnectModifier = "mc_ModifierSystem_connect",
    DisconnectModifier = "mc_ModifierSystem_disconnect",
}

// --- API --------------------------------------------------------------
export function spawn(name: string) {
    addToSequencer(WorldFunctions.Spawn, [name])
}

export function connect(connectionType: ConnectionType, targetEntity: string) {
    addToSequencer(WorldFunctions.Connect, [connectionType, targetEntity])
}

export function disconnect(connectionType: ConnectionType) {
    addToSequencer(WorldFunctions.Disconnect, [connectionType])
}

// !!! TODO: combine these into one functions

export function chargeClaw(sourceEntity: string) {
    addToSequencer(WorldFunctions.ChargeClaw, [sourceEntity])
}

export function chargePortal(sourceEntity: string) {
    addToSequencer(WorldFunctions.ChargePortal, [sourceEntity])
}

// !!! TODO

export function move(sourceEntity: string, targetEntity: string, x: number, y: number) {
    addToSequencer(WorldFunctions.Move, [sourceEntity, targetEntity, x, y])
}

export function exit(sourceEntity: string) {
    addToSequencer(WorldFunctions.Exit, [sourceEntity])
}

// !!! TODO: combine these into two functions

export function connectResourceSplit(sourceEntity: string, targetEntity: string) {
    addToSequencer(WorldFunctions.ConnectResourceSplit, [sourceEntity, targetEntity])
}

export function disconnectResourceSplit(sourceEntity: string) {
    addToSequencer(WorldFunctions.DisconnectResourceSplit, [sourceEntity])
}

export function connectControlSplit(sourceEntity: string, targetEntity: string)  {
    addToSequencer(WorldFunctions.ConnectControlSplit, [sourceEntity, targetEntity])
}

export function disconnectControlSplit(sourceEntity: string) {
    addToSequencer(WorldFunctions.DisconnectControlSplit, [sourceEntity])
}

export function connectModifier(sourceEntity: string, targetEntity: string) {
    addToSequencer(WorldFunctions.ConnectModifier, [sourceEntity, targetEntity])
}

export function disconnectModifier(sourceEntity: string) {
    addToSequencer(WorldFunctions.DisconnectModifier, [sourceEntity])
}

// !!! TODO

export function vote(sourceEntity: string, targetEntity: string) {
    addToSequencer(WorldFunctions.Vote, [sourceEntity, targetEntity])
}

export function settle() {
    addToSequencer(WorldFunctions.Settle, [])
}