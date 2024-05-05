import { get } from "svelte/store"
import { publicNetwork } from "@modules/network"
import { filterObjectByKey, toCamelCase, removePrivateKeys } from "@modules/utils"
import { entities } from "@modules/state/base/stores"
import { playerAddress } from "@modules/state/base/stores"
import { ENTITY_TYPE } from "@modules/state/base/enums"
import { addressToId } from "@modules/utils"
import { createComponentSystem } from "@modules/systems"

export function initEntities() {
    const tableKeys = get(publicNetwork).tableKeys
    const filteredComponents = filterObjectByKey(get(publicNetwork).components, tableKeys)

    let syncEntities = {} as Entities

    for (let i = 0; i < tableKeys.length; i++) {
        const componentKey = tableKeys[i]
        const component = filteredComponents[componentKey]
        const propertyName = componentKey === "ContainedMaterial" ? "materialId" : toCamelCase(componentKey)

        if (component?.values?.value) {
            // Single value component
            component.values.value.forEach((value: any, key: Symbol) => {
                const entityKey = key.description as string
                // Create empty object if key is not present
                if (!syncEntities[entityKey]) syncEntities[entityKey] = {}
                // Set property
                syncEntities[entityKey][propertyName] = value
            });
        } else {
            // Struct component
            const cleanedStruct = removePrivateKeys(component.values)

            Object.entries(cleanedStruct).forEach(([key, value]) => {
                const structPropertyName = toCamelCase(key)
                value.forEach((structPropertyValue: any, key: Symbol) => {
                    const entityKey = key.description as string
                    // Create empty object if key is not present
                    if (!syncEntities[entityKey]) syncEntities[entityKey] = {}
                    if (!syncEntities[entityKey][propertyName]) syncEntities[entityKey][propertyName] = {}
                    // Set property
                    syncEntities[entityKey][propertyName][structPropertyName] = structPropertyValue
                })
            })
        }
    }

    const filteredEntities = filterEntities(syncEntities)

    // Single write to store
    entities.set(filteredEntities)

    // Create systems to listen to changes to game - specific tables
    for (const componentKey of get(publicNetwork).tableKeys) {
        createComponentSystem(componentKey)
    }

}

function filterEntities(syncEntities: Entities) {
    const playerEntity = syncEntities[addressToId(get(playerAddress))]
    if (!playerEntity) return syncEntities

    const playerPodId = playerEntity.carriedBy
    if (!playerPodId) return syncEntities

    let filteredEntities = {} as Entities

    // To matche: config, orders, offers, recipes and materials
    const GLOBAL_TABLES = ['gameConfig', 'order', 'offer', 'recipe', 'materialMetadata']

    Object.entries(syncEntities).forEach(([key, entity]) => {
        if (hasCommonElement(GLOBAL_TABLES, Object.keys(entity))) {
            // Global entites
            filteredEntities[key] = entity
        } else if (entity.entityType === ENTITY_TYPE.POD) {
            // Pods
            if (key == playerPodId) {
                filteredEntities[key] = entity
            }
        } else if (entity.entityType == ENTITY_TYPE.MACHINE && entity.carriedBy) {
            // Machines
            if (entity.carriedBy == playerPodId) {
                filteredEntities[key] = entity
            }
        } else if (entity.entityType == ENTITY_TYPE.TANK && entity.carriedBy) {
            // Tanks
            if (entity.carriedBy == playerPodId) {
                filteredEntities[key] = entity
            }
        }
    })

    return filteredEntities
}

function hasCommonElement(arr1: string[], arr2: string[]): boolean {
    const set1 = new Set(arr1);
    return arr2.some(element => set1.has(element));
}
