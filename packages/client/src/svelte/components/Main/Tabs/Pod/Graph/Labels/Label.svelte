<script lang="ts">
  import {hexToString } from "viem"
  import { materialMetadata } from "@svelte/modules/state/base/stores";
  import type { GraphConnection } from "../types"
  // import TweenedText from "@components/Main/Tabs/Pod/Graph/Labels/TweenedText.svelte"
  import { CELL } from "../constants"
  // import { onDestroy } from "svelte"
  // import { bounceInOut as easing } from "svelte/easing"
  // import { tweened } from "svelte/motion"
  import { getLongestSection } from "../Connections/svg"

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

  let dir = 0
  let direction = ""

  $: material = $materialMetadata[connection?.products?.[0]?.materialId]?.name
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
      const [x, y, d] = getLongestSection(connection, CELL.HEIGHT, CELL.WIDTH)

      const dirs = ["→", "→", "←", "←"]

      labelX = x
      labelY = y
      dir = d
      direction = dirs[d]
    }
  }
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
  class:vertical={dir === 1 || dir === 3}
>
  {#key material}
    {`${direction} ${material || "EMPTY"} ${direction}`}
  {/key}
</text>

<style lang="scss">
  .label {
    font-size: var(--font-size-small);
    font-size: 10px;
    font-family: var(--font-family);
    transform-box: fill-box;
    transform-origin: center;
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
      fill: var(--white);

      &.productive {
        fill: var(--color-success);
      }
    }

    &.hover {
      display: none;
    }

    &.vertical {
      transform: translate(4px, 0) rotate(90deg);
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
