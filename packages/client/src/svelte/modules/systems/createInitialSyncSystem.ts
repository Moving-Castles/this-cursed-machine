import { get } from "svelte/store"
import { publicNetwork } from "@modules//network"
import { toCamelCase } from "@modules//utils"
import { ComponentUpdate } from "@latticexyz/recs"

export function createInitialSyncSystem(componentKey: string) {

    console.log('createInitialSyncSystem', componentKey)

    const initialEntities = {} as Entities

    (get(publicNetwork).components as any)[componentKey].update$.subscribe((update: ComponentUpdate) => {
        const [nextValue] = update.value

        // Single-value components have a "value" property, structs do not
        const newValue =
            nextValue && Object.prototype.hasOwnProperty.call(nextValue, "value")
                ? nextValue.value
                : nextValue

        const entityID = update.entity
        const propertyName = componentKey === "ContainedMaterial" ? "materialId" : toCamelCase(componentKey)

        if (initialEntities[entityID] === undefined) initialEntities[entityID] = {}
        initialEntities[entityID][propertyName] = newValue

        console.log('initialEntities', initialEntities)

    })
}
