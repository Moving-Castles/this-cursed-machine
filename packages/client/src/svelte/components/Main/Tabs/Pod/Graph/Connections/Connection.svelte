<script lang="ts">
  import type { GraphConnection } from "../types"
  import { generators, generatePoints } from "./svg"
  import { inspecting, selectedOption } from "@modules/ui/stores"
  import { quadIn as easing } from "svelte/easing"
  import { draw } from "svelte/transition"
  import { CELL } from "../constants"
  import Label from "../Labels/Label.svelte"
  import { playSound } from "@modules/sound"
  import { networkIsRunning } from "@modules/state/simulated/stores"

  export let connection: GraphConnection

  const DURATION = 400
  const inDrawOptions = { duration: DURATION, easing }
  const outDrawOptions = { duration: DURATION, easing }
  const activeCurve = "catMullRom"

  let pathElement: SVGPathElement
  let hover = false
  let showLabel = true

  $: carrying = connection?.products ? connection.products.length > 0 : false
  $: highlight = $selectedOption
    ? $selectedOption.value === connection.id
    : false
  $: disabledHighlight = highlight && $selectedOption?.available === false

  const onMouseEnter = () => {
    // if (!carrying) return
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

  const drawInStart = async () => {
    showLabel = false
    playSound("tcm", "pipeDraw")
    await new Promise(resolve => setTimeout(resolve, 300))
    setTimeout(() => {
      playSound("tcm", "pipeConnect")
    }, 200)
    showLabel = true
  }

  const drawOutStart = () => {
    showLabel = false
    playSound("tcm", "selectionEnter")
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<g
  class="connection run-potential {$networkIsRunning && connection.productive
    ? `running-${Math.floor(Math.random() * 3) + 1}`
    : ''}"
  class:hover
  class:carrying
  class:highlight
  class:disabled-highlight={disabledHighlight}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <path {d} class="pseudo" />
  <path
    {d}
    bind:this={pathElement}
    class="visible"
    class:carrying
    class:productive={connection.productive}
    in:draw={inDrawOptions}
    out:draw={outDrawOptions}
    on:introstart={drawInStart}
    on:outrostart={drawOutStart}
    fill="none"
  />
  <Label
    {hover}
    {connection}
    visible={showLabel}
    {pathElement}
    productive={connection.productive}
    {carrying}
  />
</g>

<style lang="scss">
  g {
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
      stroke: var(--white);

      &.productive {
        stroke: var(--color-success);
      }
    }
  }
</style>
