import { EntityType, MachineType } from "./enums"

export function filterByEntitytype(entities: Entities, entityType: EntityType): Entities {
    return Object.fromEntries(
        Object.entries(entities).filter(
            ([, entity]) => entity.entityType === entityType
        )
    )
}

export function filterByMachinetype(entities: Entities, machineType: MachineType): Entities {
    return Object.fromEntries(
        Object.entries(entities).filter(
            ([, entity]) => entity.machineType === machineType
        )
    )
}