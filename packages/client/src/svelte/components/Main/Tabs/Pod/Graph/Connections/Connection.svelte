<script lang="ts">
  import type { GraphConnection } from "../types"
  import { GRID, CELL } from "../constants"
  import { generateSvgPath, generateSvgArrow } from "./svg"
  import { GRAPH_ENTITY_STATE } from "@modules/state/simulated/enums"
  export let connection: GraphConnection

  const width = GRID.WIDTH * CELL.WIDTH
  const height = GRID.HEIGHT * CELL.HEIGHT

  console.log("connection", connection)

  $: d = generateSvgPath(connection, CELL.WIDTH, CELL.HEIGHT)
  $: points = generateSvgArrow(connection, CELL.WIDTH, CELL.HEIGHT)
</script>

<div
  class="connection"
  class:active={connection.state === GRAPH_ENTITY_STATE.ACTIVE}
>
  <svg {width} {height}>
    <path {d} />
    <polygon {points} />
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
        opacity: 0.7;
        fill: none;

        &:hover {
          stroke: #0000ff;
        }
      }

      polygon {
        fill: #cdcdcd;
        opacity: 0.7;
      }
    }

    &.active {
      svg {
        path {
          stroke: var(--color-active);
        }

        polygon {
          fill: var(--color-active);
          opacity: 0.7;
        }
      }
    }
  }
</style>
