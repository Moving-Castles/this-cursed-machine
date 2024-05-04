import { get } from "svelte/store"
import { publicNetwork } from "@modules/network"
import { filterObjectByKey, toCamelCase, removePrivateKeys } from "@modules/utils"
import { entities } from "@modules/state/base/stores"

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

    // Single write to store
    entities.set(syncEntities)
}
