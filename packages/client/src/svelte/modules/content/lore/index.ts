import { writable } from "svelte/store"

export const lore = {
  title: "Circuit game",
  instructions: {
    loading: {
      ready: 'circuits ready',
    }
  }
}

export const config = writable({
  janky: true
})