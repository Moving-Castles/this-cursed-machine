<script lang="ts">
  import type { GraphConnection } from "../types"
  import { generators, generatePoints, generateSvgArrow } from "./svg"
  import { inspecting, selectedOption } from "@modules/ui/stores"
  import { linear } from "svelte/easing"
  import { draw } from "svelte/transition"
  import { CELL } from "../constants"
  import Head from "./Head.svelte"
  import Label from "../Labels/Label.svelte"

  export let connection: GraphConnection

  const DURATION = 400
  const ARROW_OFFSET = 0

  let animationFrameId: number
  let headRotation = 0
  let headPoint: SVGPoint

  let pathElement: SVGPathElement

  let hover = false
  let animationStart: number
  let activeCurve = "basis"

  $: carrying = connection?.products.length > 0
  $: fill = connection.productive
    ? "var(--color-alert)"
    : carrying
      ? "var(--color-success)"
      : "var(--color-grey-light)"
  $: highlight = $selectedOption?.value === connection.id

  const getRotationAtPoint = (
    maxLength: number,
    currentLength: number,
    forwards: boolean
  ) => {
    // Calculate the angle of the arrow direction
    const delta = 0.001 // small value for calculating the derivative
    const pointBefore = pathElement.getPointAtLength(
      forwards
        ? Math.max(0, currentLength - delta)
        : Math.max(0, maxLength - currentLength - delta)
    )
    const pointAfter = pathElement.getPointAtLength(
      forwards
        ? Math.min(maxLength, currentLength + delta)
        : Math.min(maxLength, maxLength - currentLength + delta)
    )
    const dy = pointAfter.y - pointBefore.y
    const dx = pointAfter.x - pointBefore.x
    const angleInRadians = Math.atan2(dy, dx)
    let angleInDegrees = angleInRadians * (180 / Math.PI)
    if (angleInDegrees < 0) {
      angleInDegrees += 360
    }
    return angleInDegrees
  }

  const startPolling = e => {
    const intro = e.type.includes("intro")
    // Timing logic
    animationStart = performance.now()

    const animate = e => {
      const progress = (e - animationStart) / DURATION
      const maxLength = pathElement.getTotalLength() - ARROW_OFFSET
      const currentLength = maxLength * progress // Assume progress is the percentage of the path drawn
      headPoint = pathElement.getPointAtLength(
        intro ? currentLength : maxLength - currentLength
      )

      headRotation = getRotationAtPoint(maxLength, currentLength, intro)

      // Update arrowhead position here

      // Placeholder for the logic to update the arrowhead's position
      // You will need to implement the actual logic based on your application's needs
      animationFrameId = requestAnimationFrame(animate)
    }
    animate(animationStart)
  }
  const stopPolling = e => {
    const intro = e.type.includes("intro")
    cancelAnimationFrame(animationFrameId)
    headPoint = pathElement.getPointAtLength(
      intro ? pathElement.getTotalLength() - ARROW_OFFSET : 0
    )
  }

  const onMouseEnter = () => {
    if (!carrying) return
    inspecting.set(connection)
    hover = true
  }

  const onMouseLeave = () => {
    inspecting.set(null)
    hover = false
  }

  $: d = generators[activeCurve](
    generatePoints(connection, CELL.WIDTH, CELL.HEIGHT)
  )
  $: points = generateSvgArrow(connection, CELL.WIDTH, CELL.HEIGHT)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<g
  class="connection"
  class:hover
  class:carrying
  class:highlight
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <path transition:draw {d} class="pseudo" />
  <path
    {d}
    on:introstart={startPolling}
    on:outrostart={startPolling}
    on:outroend={stopPolling}
    on:introend={stopPolling}
    bind:this={pathElement}
    transition:draw={{ duration: DURATION, easing: linear }}
    class="visible"
    class:hover
    class:carrying
    class:productive={connection.productive}
  />
  <Label {connection} {carrying} {hover} productive={connection.productive} />
</g>
{#if headPoint}
  {#key headPoint}
    <Head {fill} rotation={headRotation} point={headPoint} />
  {/key}
{/if}

<style lang="scss">
  g {
    // opacity: 0.6;

    &.hover {
      opacity: 1;
    }

    &.carrying {
      cursor: none;
    }
  }

  .pseudo {
    stroke: transparent;
    stroke-width: 15;
    fill: none;
  }

  .visible {
    stroke: var(--color-grey-light);
    stroke-width: 5;
    fill: none;

    &.carrying {
      stroke: var(--color-success);

      &.hover {
        opacity: 0.8;
      }
    }

    &.hover {
      stroke: var(--color-grey-light);
    }

    &.productive {
      stroke: var(--color-alert);
    }
  }

  polygon {
    fill: var(--color-grey-light);

    &.hover {
      fill: var(--color-grey-light);
    }

    &.productive {
      fill: var(--color-alert);
    }
  }
</style>
