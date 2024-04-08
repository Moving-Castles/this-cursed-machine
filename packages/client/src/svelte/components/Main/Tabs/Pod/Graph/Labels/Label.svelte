<script lang="ts">
  import type { GraphConnection } from "../types"
  import TweenedText from "@components/Main/Tabs/Pod/Graph/Labels/TweenedText.svelte"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { CELL } from "../constants"
  import { onDestroy } from "svelte"
  import { bounceInOut as easing } from "svelte/easing"
  import { tweened } from "svelte/motion"

  export let connection: GraphConnection
  export let hover: boolean
  export let carrying: boolean
  export let productive: boolean

  let words = []

  import { getMidpoint } from "../Connections/svg"

  // const tweenStore = createTweenStore(500)

  let [labelX, labelY] = [0, 0]
  let zeroOrOne = tweened(0, { easing })

  const toggle = () => {
    $zeroOrOne === 0 ? zeroOrOne.set(1) : zeroOrOne.set(0)
  }
  let interval = setInterval(toggle, 5000)

  const tick = () => {
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)

  $: material = MATERIAL_TYPE[connection?.products?.[0]?.materialType]
  $: amount = connection?.products?.[0]?.amount / 100
  // @todo Determine the flow direction
  const direction = ">"

  $: {
    if (material && amount && direction) {
      words = [">>>", material]
    }
  }

  $: {
    let [x, y] = getMidpoint(connection, CELL.WIDTH, CELL.HEIGHT)

    labelX = x
    labelY = y
  }

  onDestroy(() => clearInterval(interval))
</script>

{#if connection?.products?.length > 0 && words.length > 0}
  <text
    text-anchor="middle"
    x={labelX}
    y={labelY}
    class:hover
    class:carrying
    class:productive
    class="label"
  >
    <TweenedText {words} />
  </text>
{/if}

<style lang="scss">
  .label {
    font-size: var(--font-size-small);
    font-family: var(--font-family);
    transform-box: fill-box;
    transform: translate(0, 4px);
    text-align: center;
    stroke-width: 3;
    paint-order: stroke;
    stroke: var(--color-grey-mid);

    &.carrying {
      fill: var(--color-success);
    }

    &.productive {
      fill: var(--color-alert);
    }
  }

  .label-below {
    font-size: var(--font-size-small);
    font-family: var(--font-family);
    transform-box: fill-box;
    transform: translate(0, 100%);
    text-align: center;
  }
</style>
