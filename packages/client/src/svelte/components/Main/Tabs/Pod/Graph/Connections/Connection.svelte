<script lang="ts">
  import type { GraphConnection } from "../types"
  import {
    generators,
    generatePoints,
    generateSvgArrow,
    getRotationAtPoint,
  } from "./svg"
  import { inspecting, selectedOption } from "@modules/ui/stores"
  import { linear } from "svelte/easing"
  import { draw } from "svelte/transition"
  import { CELL } from "../constants"
  import Head from "./Head.svelte"
  import Label from "../Labels/Label.svelte"
  import GradientPath from "./GradientPath.svelte"

  export let connection: GraphConnection

  const DURATION = 400
  const ARROW_OFFSET = 0
  const drawOptions = { duration: DURATION, easing: linear }

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

  const startPolling = e => {
    const intro = e.type.includes("intro")
    // Timing logic
    animationStart = performance.now()

    const frame = e => {
      const progress = (e - animationStart) / DURATION
      const maxLength = pathElement.getTotalLength() - ARROW_OFFSET
      const currentLength = maxLength * progress // Assume progress is the percentage of the path drawn

      headPoint = pathElement.getPointAtLength(
        intro ? currentLength : maxLength - currentLength
      )
      headRotation = getRotationAtPoint(
        pathElement,
        maxLength,
        currentLength,
        intro
      )

      animationFrameId = requestAnimationFrame(frame)
    }
    frame(animationStart)
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
  <path {d} class="pseudo" />
  <path
    {d}
    on:introstart={startPolling}
    on:outrostart={startPolling}
    on:outroend={stopPolling}
    on:introend={stopPolling}
    bind:this={pathElement}
    transition:draw={drawOptions}
    class="visible"
    class:hover
    class:carrying
    class:productive={connection.productive}
  />
  {#if connection.productive || carrying}
    <GradientPath {d} {carrying} productive={connection.productive} />
  {/if}
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
