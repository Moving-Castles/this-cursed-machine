<script lang="ts">
  import type { GraphConnection } from "../types"
  import { generators, generatePoints, generateSvgArrow } from "./svg"
  import { fade } from "svelte/transition"
  import { inspecting } from "@modules/ui/stores"
  import { draw } from "svelte/transition"
  import { CELL } from "../constants"
  import { sleep } from "@modules/utils"
  import Label from "../Labels/Label.svelte"

  export let connection: GraphConnection

  const options = Object.keys(generators)

  let hover = false
  let activeCurve = "basis"

  $: carrying = connection?.products.length > 0

  const onMouseEnter = () => {
    if (!carrying) return
    inspecting.set(connection)
    hover = true
  }

  const onMouseLeave = () => {
    inspecting.set(null)
    hover = false
  }

  const testCurve = e => {
    if (import.meta.env.DEV && e.key === ">" && e.shiftKey) {
      const index = options.indexOf(activeCurve)

      activeCurve = options[(index + 1) % options.length]

      d = generators[activeCurve](
        generatePoints(connection, CELL.WIDTH, CELL.HEIGHT)
      )
    }
  }

  $: d = generators[activeCurve](
    generatePoints(connection, CELL.WIDTH, CELL.HEIGHT)
  )
  $: points = generateSvgArrow(connection, CELL.WIDTH, CELL.HEIGHT)
</script>

<svelte:window on:keydown={testCurve} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<g
  class:hover
  class:carrying
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <path transition:draw {d} class="pseudo" />
  <path
    {d}
    transition:draw
    class="visible"
    class:hover
    class:carrying
    class:productive={connection.productive}
  />
  <Label {connection} {carrying} {hover} productive={connection.productive} />
</g>

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
