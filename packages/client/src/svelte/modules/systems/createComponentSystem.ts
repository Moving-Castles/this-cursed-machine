import { get } from "svelte/store"
import { entities } from "../state/base/stores"
import { publicNetwork } from "../network"
import { toCamelCase } from "../utils"
import { ComponentUpdate } from "@latticexyz/recs"

export function createComponentSystem(componentKey: string) {
  console.log('comp sys');
  (get(publicNetwork).components as any)[componentKey].update$.subscribe((update: ComponentUpdate) => {
    console.log('update', update);
    const [nextValue] = update.value

    // Single-value components have a "value" property, structs do not
    const newValue =
      nextValue && Object.prototype.hasOwnProperty.call(nextValue, "value")
        ? nextValue.value
        : nextValue

    const entityID = update.entity
    const propertyName = componentKey === "ContainedMaterial" ? "materialId" : toCamelCase(componentKey)

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
  })
}

// import { get } from "svelte/store"
// import { entities } from "../state/base/stores"
// import { publicNetwork } from "../network"
// import { toCamelCase } from "../utils"
// // import { ComponentUpdate } from "@latticexyz/recs"
// import { debounce } from "lodash";


// const processUpdates = debounce((updates) => {
//   entities.update(currentEntities => {
//     updates.forEach(({ entityID, propertyName, newValue }) => {
//       if (currentEntities[entityID] === undefined) currentEntities[entityID] = {};
//       if (newValue === undefined) {
//         delete currentEntities[entityID][propertyName];
//       } else {
//         currentEntities[entityID][propertyName] = newValue;
//       }
//     });
//     return currentEntities;
//   });
// }, 100); // Update at most once per 100 milliseconds

// export function createComponentSystem(componentKey) {
//   (get(publicNetwork).components)[componentKey].update$.subscribe((update) => {
//     const [nextValue] = update.value;
//     const newValue = nextValue && "value" in nextValue ? nextValue.value : nextValue;
//     const entityID = update.entity;
//     const propertyName = componentKey === "ContainedMaterial" ? "materialId" : toCamelCase(componentKey);

//     processUpdates([{ entityID, propertyName, newValue }]);
//   });
// }