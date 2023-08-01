import { EntityType } from "../state/types";
import { addToSequencer } from "./actionSequencer";

export enum WorldFunctions {
    Spawn = "mc_SpawnSystem_spawn",
    BuildOrgan = "mc_BuildSystem_buildOrgan",
    BuildConnection = "mc_BuildSystem_buildConnection",
    Destroy = "mc_BuildSystem_destroy",
}

// --- API --------------------------------------------------------------

export function spawn(name: string) {
    addToSequencer(WorldFunctions.Spawn, [name])
}

export function build(entityType: EntityType, x: number, y: number) {
    addToSequencer(WorldFunctions.BuildOrgan, [entityType, x, y])
}

export function destroy(entity: string) {
    addToSequencer(WorldFunctions.Destroy, [entity])
}

export function connect(entityType: EntityType, sourceEntity: string, targetEntity: string) {
    addToSequencer(WorldFunctions.BuildConnection, [entityType, sourceEntity, targetEntity])
}

export function disconnect(entity: string) {
    addToSequencer(WorldFunctions.Destroy, [entity])
}
