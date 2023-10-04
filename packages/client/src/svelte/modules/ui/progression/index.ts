import { readable, writable } from "svelte/store"

export const currentGoalIndex = writable(0)
export const achieved = writable([])
// Reward has to be one word
export const progressions = readable([
  [
    { goal: "Connect yourself to the inlet", reward: "ALIVE" },
    { goal: "Produce 200 blood", reward: "FULLY-CHARGED" },
    { goal: "Pool 200 of your blood", reward: "EXTENDACORE" },
  ],
  [
    { goal: "Connect yourself to the inlet", reward: "ALIVE" },
    { goal: "Produce 200 blood", reward: "FULLY-CHARGED" },
    { goal: "Pool 200 of your blood", reward: "EXTENDACORE" },
  ],
])
