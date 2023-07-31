import { EntityType, ConnectionType } from "../state/types";
import { addToSequencer } from "./actionSequencer";

export enum WorldFunctions {
    Spawn = "mc_SpawnSystem_spawn",
    Build = "mc_BuildSystem_build",
    Destroy = "mc_BuildSystem_destroy",
}

// --- API --------------------------------------------------------------

export function spawn(name: string) {
    addToSequencer(WorldFunctions.Spawn, [name])
}

export function build(entityType: EntityType, x: number, y: number) {
    addToSequencer(WorldFunctions.Build, [entityType, {x, y}])
}

export function destroy(entity: string) {
    addToSequencer(WorldFunctions.Destroy, [entity])
}

export function connect(entityType: EntityType, sourceEntity: string, targetEntity: string) {
    addToSequencer(WorldFunctions.Build, [entityType, sourceEntity, targetEntity])
}

export function disconnect(entity: string) {
    addToSequencer(WorldFunctions.Destroy, [entity])
}
