<script lang="ts">
  import type { GraphConnection } from "../types"
  import { generateSvgPath, generateSvgArrow } from "./svg"
  import { inspecting } from "@modules/ui/stores"
  import { CELL } from "../constants"
  export let connection: GraphConnection

  let hover = false

  const onMouseEnter = () => {
    inspecting.set(connection)
    hover = true
  }

  const onMouseLeave = () => {
    inspecting.set(null)
    hover = false
  }

  $: d = generateSvgPath(connection, CELL.WIDTH, CELL.HEIGHT)
  $: points = generateSvgArrow(connection, CELL.WIDTH, CELL.HEIGHT)
</script>

<g class:hover on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
  <path {d} class="pseudo" />
  <path
    {d}
    class="visible"
    class:hover
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

    &.hover {
      stroke: blue;
    }

    &.productive {
      stroke: red;
    }
  }

  polygon {
    fill: #cdcdcd;

    &.hover {
      fill: blue;
    }

    &.productive {
      fill: red;
    }
  }
</style>
