<script lang="ts">
  import type { GraphConnection } from "../types"
  import { generateSvgPath, generateSvgArrow } from "./svg"
  import { inspecting } from "@modules/ui/stores"
  import { CELL } from "../constants"
  export let connection: GraphConnection

  let hover = false

  $: carrying = connection?.products.length > 0

  const onMouseEnter = () => {
    if (!carrying) return
    inspecting.set({ type: "connection", connection })
    hover = true
  }

  const onMouseLeave = () => {
    inspecting.set(null)
    hover = false
  }

  $: d = generateSvgPath(connection, CELL.WIDTH, CELL.HEIGHT)
  $: points = generateSvgArrow(connection, CELL.WIDTH, CELL.HEIGHT)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<g
  class:hover
  class:carrying
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <path {d} class="pseudo" />
  <path
    {d}
    class="visible"
    class:hover
    class:carrying
    class:productive={connection.productive}
  />
  <polygon {points} class:hover class:productive={connection.productive} />
</g>

<style lang="scss">
  g {
    opacity: 0.6;

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
    stroke: #cdcdcd;
    stroke-width: 5;
    fill: none;

    &.carrying {
      stroke: var(--color-active);

      &.hover {
        stroke: #00ff00;
      }
    }

    &.hover {
      stroke: rgb(149, 149, 149);
    }

    &.productive {
      stroke: red;
    }
  }

  polygon {
    fill: #cdcdcd;

    &.hover {
      fill: rgb(149, 149, 149);
    }

    &.productive {
      fill: red;
    }
  }
</style>
