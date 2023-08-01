import { writable } from "svelte/store"

export const lore = {
  title: "THIS CURSED MACHINE",
  instructions: {
    loading: {
      ready: 'circuits ready',
    }
  }
}

export const config = writable({
  janky: false
})