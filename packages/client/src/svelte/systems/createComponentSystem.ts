import { get } from "svelte/store";
import { entities } from "../modules/state";
import { network } from "../modules/network";
import { toCamelCase } from "../utils/misc";

export function createComponentSystem(componentKey: string) {

  // const components = get(network).components
  // components[componentKey as keyof typeof components]
  // ...

  get(network).components[componentKey].update$.subscribe(update => {
    console.log("==>", componentKey, update);
    const [nextValue] = update.value

    // Single-value components have a "value" property, structs do not
    const newValue =
      nextValue && Object.prototype.hasOwnProperty.call(nextValue, "value")
        ? nextValue.value
        : nextValue;

    const entityID = update.entity;
    const propertyName = toCamelCase(componentKey);

    entities.update((value) => {
      // Create an empty entity if it does not exist
      if (value[entityID] === undefined) value[entityID] = {};

      // @todo: fix types
      if (newValue === undefined) {
        delete value[entityID][propertyName];
      } else {
        value[entityID][propertyName] = newValue;
      }

      return value;
    });

  })
}
