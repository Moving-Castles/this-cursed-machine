import { ENTITY_TYPE, MACHINE_TYPE } from "./enums"

export function filterByEntitytype(entities: Entities, entityType: ENTITY_TYPE): Entities {
    return Object.fromEntries(
        Object.entries(entities).filter(
            ([, entity]) => entity.entityType === entityType
        )
    )
}

export function filterByMachinetype(entities: Entities, machineType: MACHINE_TYPE): Entities {
    return Object.fromEntries(
        Object.entries(entities).filter(
            ([, entity]) => entity.machineType === machineType
        )
    )
}