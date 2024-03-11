<script lang="ts">
  import type { GraphConnection } from "../types"
  import { generateSvgPath2 } from "./svg"
  export let connection: GraphConnection

  const width = 900
  const height = 600

  $: d = generateSvgPath2(connection.elkEdge)
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
        stroke-width: 2;
        fill: none;
      }
    }
  }
</style>
