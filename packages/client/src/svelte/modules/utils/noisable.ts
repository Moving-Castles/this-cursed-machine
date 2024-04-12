import { writable } from "svelte/store"

if (import.meta.env.DEV) {
  console.warn(
    "You are using the noisable™️ store. Make sure to call noisable.stop() in your component lifecycle hook"
  )
}

// Generate a random gradient vector (1D in this case, so just a random value)
const generateGradient = () => Math.random() * 2 - 1

// Smoothstep interpolation
const smoothstep = t => t * t * (3 - 2 * t)

// Linear interpolation
const lerp = (a, b, t) => a + (b - a) * smoothstep(t)

// Perlin noise function for 1D
function perlin(x) {
  const x0 = Math.floor(x)
  const x1 = x0 + 1

  const sx = x - x0

  const grad0 = generateGradient()
  const grad1 = generateGradient()

  const dot0 = (x - x0) * grad0
  const dot1 = (x - x1) * grad1

  // Interpolate between the two dot products
  return lerp(dot0, dot1, sx)
}

// Custom Svelte store
function createNoiseStore() {
  const { subscribe, set } = writable(0)
  let frame
  let time = 0

  function update() {
    const newValue = perlin(time)
    set(newValue)
    time += 0.0001 // Adjust this value to control the "speed" of the noise

    frame = requestAnimationFrame(update)
  }

  // Start the loop
  update()

  return {
    subscribe,
    stop: () => {
      cancelAnimationFrame(frame)
    },
  }
}

export const noisable = () => createNoiseStore()

export default noisable
