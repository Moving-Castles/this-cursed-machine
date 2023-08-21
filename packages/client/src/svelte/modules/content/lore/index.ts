import { readable, writable } from "svelte/store"

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

export const narrative = readable({
  intro: [
"ahhhh, you're awake",
"such a pleasure to meet our newest flesh tribute",
"no, don't try moving -- you can't do that any more", `
Allow me to introduce myself:

I'm Puppitywink, your new manager`,
`Bllow me to introduce myself:

get ready for an experience...
`
]
})