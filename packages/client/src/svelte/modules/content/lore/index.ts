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
"You will soon be placed in a Box.",
"Boxes are Controlled Production Environments essential to the functioning and upkeep of this operation.",
 "Each Box is specially designed to allow the production of novel Materials...",
 "...and you are here to produce them.",
"Your stumps will be wired in to the controls of this box.",
'[...stumps?]',
"stumps? ha ha ha",
"we removed your limbs for ease of access. thank me later.",
"As I was saying: in each Box, an inlet pipe pumps material in, and an outflow pipe allows you to move material out. The materials are processed by a series of machines, including your good self.",
"To complete the Box, you must wire the required material to the outlet.",
"Connect up the machines via a series of pipes to mix, crunch, scorch, digest and metabolise your way out.",
"You pay for the machines with your own, precious energy. Be careful not to let it run out!",
'[AAAAAAAAAAAGHHH!!!]',
"Ah, stop screaming, it's not all so bad.",
"If you do well here, you might even get a sticker!",
"Now wouldn't that be nice?",
'[yes]',
"Right! enough chat.",
"All you know now is pipes, machines, and piss. Get salivating!",
"[START]",
],
help: `Commands:
(Add machine)       [m]
(Add pipe)          [p]
(Help)              [h]
(Call puppitywink)  [wink]
`
})