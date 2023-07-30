import { EntityType } from "../state/types";
import { addToSequencer } from "./actionSequencer";

export enum WorldFunctions {
    Spawn = "mc_SpawnSystem_spawn",
    Build = "mc_BuildSystem_build"
}

// --- API --------------------------------------------------------------
export function spawn(name: string) {
    addToSequencer(WorldFunctions.Spawn, [name])
}

export function build(entityType: EntityType, x: number, y: number) {
    if(![EntityType.RESOURCE, EntityType.RESOURCE_TO_ENERGY].includes(entityType)) return;
    addToSequencer(WorldFunctions.Build, [entityType, x, y])
}