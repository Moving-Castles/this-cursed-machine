<script lang="ts">
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import type { GraphConnection } from "../types"
  import { GRID, CELL } from "../constants"
  import { generateSvgPath } from "./svg"
  export let connection: GraphConnection

  const width = GRID.WIDTH * CELL.WIDTH
  const height = GRID.HEIGHT * CELL.HEIGHT

  $: d = generateSvgPath(connection, CELL.WIDTH, CELL.HEIGHT)

  $: hasProduct =
    connection.hasOwnProperty("product") &&
    connection.product &&
    connection.product.materialType !== MATERIAL_TYPE.NONE

  /*
   * CONNECTION_STATE = {
   * INPRODUCTIVE (not in the chain from )
   * PRODUCTIVE
   * PRODUCING
   * }
   */

  /*
   * material = MATERIAL_TYPE | MATERIAL_TYPE.NONE if unknown
   * state = CONNECTION_STATE
   */
</script>

<div class="connection" class:product={hasProduct}>
  <svg {width} {height}>
    <path
      {d}
      alt={hasProduct ? MATERIAL_TYPE[connection.product.materialType] : ""}
    />
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

    &.product {
      svg {
        path {
          stroke: #00ff00;
        }
      }
    }
  }
</style>
