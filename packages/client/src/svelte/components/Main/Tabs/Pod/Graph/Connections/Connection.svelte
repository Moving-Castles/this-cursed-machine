<script lang="ts">
  import type { GraphConnection } from "../types"
  import { GRID, CELL } from "../constants"
  import { generateSvgPath } from "./svg"
  import { GRAPH_ENTITY_STATE } from "@modules/state/simulated/enums"
  export let connection: GraphConnection

  const width = GRID.WIDTH * CELL.WIDTH
  const height = GRID.HEIGHT * CELL.HEIGHT

  $: d = generateSvgPath(connection, CELL.WIDTH, CELL.HEIGHT)
</script>

<div
  class="connection"
  class:active={connection.state === GRAPH_ENTITY_STATE.ACTIVE}
>
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
        stroke: #cdcdcd;
        stroke-width: 5;
        opacity: 0.5;
        fill: none;

        &:hove {
          stroke: #0000ff;
        }
      }
    }

    &.active {
      svg {
        path {
          stroke: #00ff00;
        }
      }
    }
  }
</style>
