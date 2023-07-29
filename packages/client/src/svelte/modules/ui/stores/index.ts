import { writable } from "svelte/store"
import { tweened } from "svelte/motion"

export const delayedWritable = (resetToValue, delay) => {
  const { subscribe, set } = writable(resetToValue);

  return {
    subscribe,
    set: (newV) => {
      set(newV)
      setTimeout(() => set(resetToValue), delay)
    }
  };
}


/**
 * @param resetToValue
 * @param delay
 */
export const delayedTweened = (resetToValue, delay) => {
  const { subscribe, set } = tweened(resetToValue);

  return {
    subscribe,
    set: (newV) => {
      set(newV)
      setTimeout(() => set(resetToValue), delay)
    }
  };
}
