import { readable, writable } from "svelte/store"

export const currentGoalIndex = writable(0)
export const achieved = writable([] as number[])
export const progressions = readable([
  [
    // Reward has to be one word
    { goal: "Connect yourself to the inlet", reward: "ALIVE" },
    { goal: "Produce 200 blood", reward: "FULLY-CHARGED" },
    { goal: "Pool 200 of your blood", reward: "EXTENDACORE" },
  ],
])
