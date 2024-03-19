<script lang="ts">
  import type { GraphConnection } from "../types"
  import { GRID, CELL } from "../constants"
  import { generateSvgPath } from "./svg"
  export let connection: GraphConnection

  const width = GRID.WIDTH * CELL.WIDTH
  const height = GRID.HEIGHT * CELL.HEIGHT

  const scaleFactorWidth = 0.1 // Scale factor for width
  const scaleFactorHeight = 0.1 // Scale factor for height

  $: d = generateSvgPath(connection, CELL.WIDTH, CELL.HEIGHT)
</script>

<div class="connection">
  <svg {width} {height}>
    <defs>
      <marker
        id="arrowhead"
        markerWidth={CELL.WIDTH * scaleFactorWidth}
        markerHeight={CELL.HEIGHT * scaleFactorHeight}
        refX="0"
        refY={(CELL.HEIGHT * scaleFactorHeight) / 2}
        orient="auto"
      >
        <polygon
          points="0,0 {CELL.WIDTH * scaleFactorWidth},{(CELL.HEIGHT *
            scaleFactorHeight) /
            2} 0,{CELL.HEIGHT * scaleFactorHeight}"
        />
      </marker>
    </defs>
    <path {d} marker-mid="url(#arrowhead)" />
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
        stroke: var(--color-active);
        stroke-width: 10;
        opacity: 0.5;
        fill: none;
      }
    }
  }
</style>
