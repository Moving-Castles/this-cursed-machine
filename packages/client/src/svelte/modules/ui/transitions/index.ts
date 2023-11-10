import { fly } from "svelte/transition"
import { stepsEasing } from "../../utils/misc"
import { get } from "svelte/store"
import { linear, expoIn } from "svelte/easing"
import { graphPulse } from "../../ui/stores"

export const steppedFlyTop = node => {
  return fly(node, { y: -40, duration: 200, easing: stepsEasing })
}

export const steppedFlyBottom = node => {
  return fly(node, { y: 40, duration: 200, easing: stepsEasing })
}

export function strobe(node, { duration = 344, steps = 2, easing = linear }) {
  const totalDuration = duration
  const interval = totalDuration / (steps * 2) // because we need to turn on and off for each step

  return {
    duration: totalDuration,
    easing,
    tick: t => {
      if (t < 1) {
        // Calculate the current time based on the progress and total duration
        let currentTime = t * totalDuration

        // Determine if we are in an "on" or "off" interval
        let currentInterval = Math.floor(currentTime / interval)
        let opacity = currentInterval % 2 === 0 ? 1 : 0

        // Apply the opacity to the node
        node.style.opacity = opacity
      } else {
        node.style.opacity = 1
      }
    },
  }
}

export function scale(node, { duration = 1000, delay = 0 }) {
  const style = getComputedStyle(node)
  const transform = style.transform === "none" ? "" : style.transform

  return {
    delay,
    duration,
    easing: expoIn,
    css: (t, u) => `
      transform: ${transform} scale(${1 + t * 0.2}, 1);
    `,
  }
}

/**
 * Tick this
 */
export const pulseGraph = () => {
  // console.log("PULSE!")
  const graphPulseValue = get(graphPulse)
  graphPulse.set(graphPulseValue - 1)
}

/** Extended version of Svelte's draw */
export function draw(
  node,
  { delay = 0, speed, duration, easing = expoIn, dasharray = "" } = {}
) {
  let len = node.getTotalLength()
  const style = getComputedStyle(node)
  if (style.strokeLinecap !== "butt") {
    len += parseInt(style.strokeWidth)
  }
  if (duration === undefined) {
    if (speed === undefined) {
      duration = 800
    } else {
      duration = len / speed
    }
  } else if (typeof duration === "function") {
    duration = duration(len)
  }
  // console.log(len)
  return {
    delay,
    duration,
    easing,
    css: (_, u) => `
			stroke-dasharray: ${len};
			stroke-dashoffset: ${u * len};
		`,
  }
}
