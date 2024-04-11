import { writable } from "svelte/store"

function walkable(
  startValue = 0.5,
  stepSize = 0.02,
  min = 0,
  max = 1,
  speed = 0.1
) {
  let frame: number
  const { subscribe, set } = writable(startValue) // Start in the middle
  let currentValue = startValue
  let targetValue = currentValue

  function update() {
    // Approach the target value at the current speed
    currentValue += (targetValue - currentValue) * speed
    currentValue = Math.min(max, Math.max(min, currentValue))

    set(currentValue)

    // If close enough to the target, choose a new target
    if (Math.abs(targetValue - currentValue) < 0.005) {
      Math.min(1, Math.max(0, currentValue + stepSize))
    }

    frame = requestAnimationFrame(update)
  }

  // Start the update loop
  update()

  return {
    subscribe,
    stop: () => {
      cancelAnimationFrame(frame)
    },
  }
}

export default walkable
