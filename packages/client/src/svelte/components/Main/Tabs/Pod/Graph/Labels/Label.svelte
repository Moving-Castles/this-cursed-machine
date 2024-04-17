<script lang="ts">
  import type { GraphConnection } from "../types"
  // import TweenedText from "@components/Main/Tabs/Pod/Graph/Labels/TweenedText.svelte"
  import { CELL } from "../constants"
  import { MATERIAL_TYPE } from "contracts/enums"
  // import { onDestroy } from "svelte"
  // import { bounceInOut as easing } from "svelte/easing"
  // import { tweened } from "svelte/motion"
  import { getLongestHorizontalSection } from "../Connections/svg"

  export let connection: GraphConnection
  export let hover: boolean
  export let carrying: boolean
  export let productive: boolean
  export let pathElement: SVGPathElement
  // Putting the visibility toggle here because of this issue:
  // https://github.com/sveltejs/svelte/issues/6479
  export let visible: boolean

  let words = []
  // let frameId: number

  let [labelX, labelY] = [0, 0]
  // let zeroOrOne = tweened(0, { easing })
  // let zeroOrOne = 1

  let direction = ""

  // const toggle = () => {
  //   $zeroOrOne === 0 ? zeroOrOne.set(1) : zeroOrOne.set(0)
  // }
  // let interval = setInterval(toggle, 5000)

  // const tick = () => {
  //   requestAnimationFrame(tick)
  // }

  // frameId = requestAnimationFrame(tick)

  // @todo Determine the flow direction
  // const direction = ">"

  $: material = MATERIAL_TYPE[connection?.products?.[0]?.materialType]
  $: amount = connection?.products?.[0]?.amount / 100

  $: {
    if (material && amount && direction) {
      words = [`${direction} ${material} ${direction}`]
    }
    if (direction) {
      words = [`${direction} none ${direction}`]
    }
  }

  $: {
    if (pathElement) {
      const [x, y, forwards] = getLongestHorizontalSection(
        connection,
        CELL.HEIGHT,
        CELL.WIDTH,
      )

      labelX = x
      labelY = y
      direction = forwards ? "→" : "←"
    }
  }

  // onDestroy(() => {
  //   clearInterval(interval)
  //   cancelAnimationFrame(frameId)
  // })
</script>

<text
  text-anchor="middle"
  x={labelX}
  y={labelY}
  class:hover
  class:carrying
  class:productive
  class:visible
  class="label"
>
  {#key material}
    {`${direction} ${material || "EMPTY"} ${direction}`}
    <!-- <TweenedText
      mouseover={hover}
      words={["", `${direction} ${material || "EMPTY"} ${direction}`]}
    /> -->
  {/key}
</text>

<style lang="scss">
  .label {
    font-size: var(--font-size-small);
    font-size: 10px;
    font-family: var(--font-family);
    transform-box: fill-box;
    transform: translate(0, 8px);
    text-align: center;
    stroke-width: 3;
    paint-order: stroke;
    stroke: var(--color-grey-mid);
    white-space: pre;
    fill: var(--color-grey-light);

    opacity: 0;
    &.visible {
      opacity: 1;
    }

    &.carrying {
      fill: var(--color-success);
    }

    &.hover {
      display: none;
    }

    // &.productive {
    //   fill: var(--color-alert);
    // }
  }

  .label-below {
    font-size: var(--font-size-small);
    font-family: var(--font-family);
    transform-box: fill-box;
    transform: translate(0, 100%);
    text-align: center;
  }
</style>
