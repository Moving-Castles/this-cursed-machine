import { sineInOut } from "svelte/easing"

export function flicker(
  node: Element,
  { delay = 0, duration = 1000, easing = sineInOut } = {}
) {
  const originalOpacity = +getComputedStyle(node).opacity
  const originalWidth = +getComputedStyle(node).width
  // Descriptive variables for the flicker effect
  const baseFrequency = 1 // Base frequency for the primary sine wave
  const frequencyVariance = 15 // Additional random variance added to the base frequency
  const secondaryFrequency = 30 // Frequency for the secondary sine wave, creating the rapid flickers
  const flickerAmplitude = 0.8 // Amplitude of the flicker effect, controlling the intensity of light-dark variations
  const flickerVariability = 0.5 // Additional random factor to occasionally amplify the flicker effect

  return {
    delay,
    duration,
    easing,
    css: (t: number) => {
      // Flicker effect calculation using descriptive variables
      let flickerEffect =
        Math.sin(
          t * Math.PI * (Math.random() * frequencyVariance + baseFrequency)
        ) *
        Math.sin(t * Math.PI * secondaryFrequency) *
        flickerAmplitude
      // Opacity calculation with variability for more pronounced flickers
      let opacity =
        Math.min(
          Math.max(t + flickerEffect * (Math.random() + flickerVariability), 0),
          1
        ) * originalOpacity
      return `opacity: ${opacity}; width: ${originalWidth}px`
    },
  }
}

export function valve(
  node: Element,
  { delay = 0, duration = 100, easing = sineInOut } = {}
) {
  const originalOpacity = +getComputedStyle(node).opacity

  return {
    delay,
    duration,
    easing,
    css: (t: number) => {
      let filter = ""
      const randomX = -200 + Math.random() * 400
      const randomY = -200 + Math.random() * 400

      const littleSkew = Math.random() > 0.8 ? 10 : 0

      let opacity = t * originalOpacity

      if (t > 0.96) return "filter: invert(1)"

      return `transform: translate(${Math.random() > 0.3 && randomX}px, ${Math.random() && randomY}px) skew(${littleSkew}deg) rotate(${littleSkew}deg); opacity: ${opacity}; ${filter}`
    },
  }
}
