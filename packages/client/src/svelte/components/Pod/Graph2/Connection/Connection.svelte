<script lang="ts">
  import type { GraphConnection } from "../types"
  import { GRID, CELL_HEIGHT, CELL_WIDTH } from "../constants"
  import { generateSvgPath } from "./svg"
  export let connection: GraphConnection

  const width = GRID.WIDTH * CELL_WIDTH
  const height = GRID.HEIGHT * CELL_HEIGHT

  $: d = generateSvgPath(connection, CELL_WIDTH, CELL_HEIGHT)
</script>

<div class="connection">
  <svg {width} {height}>
    <path {d} />
  </svg>
</div>

<style lang="scss">
  .connection {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    svg {
      path {
        stroke: #00ff00;
        stroke-width: 5;
        fill: none;
      }
    }
  }
</style>
