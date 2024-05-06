import { get } from "svelte/store"
import { entities, playerNames } from "../state/base/stores"
import { publicNetwork } from "../network"
import { toCamelCase } from "../utils"
import { ComponentUpdate } from "@latticexyz/recs"
import { deepEqual } from "@wagmi/core"

export function createComponentSystem(componentKey: string) {
  ;(get(publicNetwork).components as any)[componentKey].update$.subscribe(
    (update: ComponentUpdate) => {
      const [nextValue, prevValue] = update.value

      // If the values are the same we assume
      // this is directly after hydration
      // Abort
      if (deepEqual(nextValue, prevValue)) return

      const entityID = update.entity
      const propertyName =
        componentKey === "ContainedMaterial"
          ? "materialId"
          : toCamelCase(componentKey)

      // TODO: filter updates
      // - Update to component comes in
      // - is the component on a type of entity that we might want to filter?
      // - is the update relevant to the player?

      // Single-value components have a "value" property, structs do not
      const newValue =
        nextValue && Object.prototype.hasOwnProperty.call(nextValue, "value")
          ? nextValue.value
          : nextValue

      // Update the playernames store
      playerNames.update(value => {
        if (propertyName !== "name" || entityID in value) return value

        value[entityID] = newValue

        return value
      })

      entities.update(value => {
        // Create an empty entity if it does not exist
        if (value[entityID] === undefined) value[entityID] = {}

        // Set or delete
        if (newValue === undefined) {
          delete value[entityID][propertyName]
        } else {
          value[entityID][propertyName] = newValue
        }

        return value
      })
    }
  )
}
