<script lang="ts">
  import type { GraphConnection } from "../types"
  import { get } from "svelte/store"
  import { tweened } from "svelte/motion"
  import { generators, generatePoints } from "./svg"
  import { inspecting, selectedOption, graphPulse } from "@modules/ui/stores"
  import { quadIn as easing, expoIn } from "svelte/easing"
  import { fade, draw } from "svelte/transition"
  import { CELL } from "../constants"
  import { playSound } from "@modules/sound"
  import { blockNumber } from "@modules/network"
  import { materialMetadata } from "@modules/state/base/stores"
  import { networkIsRunning } from "@modules/state/simulated/stores"
  import Label from "../Labels/Label.svelte"

  export let connection: GraphConnection

  const DURATION = 400
  const [STROKE, GAP] = [20, 10]
  const inDrawOptions = { duration: DURATION, easing }
  const outDrawOptions = { duration: DURATION, easing }
  const activeCurve = "catMullRom"

  let pathElement: SVGPathElement
  let hover = false
  let showLabel = true
  let freeze = get(graphPulse) * GAP
  const localPulse = tweened(freeze, { duration: 500, easing: expoIn })
  const localBlockNumber = get(blockNumber)

  $: carrying = connection?.products ? connection.products.length > 0 : false
  $: highlight = $selectedOption
    ? $selectedOption.value === connection.id
    : false
  $: disabledHighlight = highlight && $selectedOption?.available === false
  $: stroke = carrying ? materialColor : "#fff"
  $: $localPulse = connection.productive ? $graphPulse * GAP : freeze * GAP
  $: materialColor = carrying
    ? $materialMetadata[connection.products[0].materialId]?.color?.hex
    : "inherit"
  $: $graphPulse = (Number($blockNumber) - Number(localBlockNumber)) * -1

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
  <!-- Path for clicking -->
  <path {d} class="pseudo" />
  <!-- Actual path -->
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
  <!-- Path for dashes -->
  <path
    in:fade={{ duration: 200, delay: 500 }}
    out:fade={{ duration: 100 }}
    {d}
    {stroke}
    class="visible dash"
    fill="none"
    stroke-dasharray="{STROKE}, {GAP}"
    stroke-dashoffset={$localPulse}
    stroke-linecap="butt"
  />
  <Label
    {hover}
    {connection}
    visible={showLabel}
    {pathElement}
    productive={connection.productive}
    color={materialColor}
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
    stroke-width: 5;
    fill: none;

    &:not(.carrying):not(.productive):not(.dash) {
      stroke: var(--color-grey-dark);
    }

    &.carrying {
      stroke: var(--color-grey-dark);

      &.productive {
        // stroke: var(--color-success);
      }
    }
  }
</style>
