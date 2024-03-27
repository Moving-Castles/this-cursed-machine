<script lang="ts">
  import { GRID } from "../constants"
  import {
    getCostAt,
    getWalkableAt,
  } from "@components/Main/Tabs/Pod/Graph/Pathfinding/grid"
  export let grid: Grid
</script>

{#each Array(GRID.HEIGHT) as _, j}
  <div class="row">
    {#each Array(GRID.WIDTH) as __, i}
      <div
        data-cost={getCostAt(grid, i, j)}
        data-walkable={getWalkableAt(grid, i, j)}
        class="cell"
      ></div>
    {/each}
  </div>
{/each}

<style lang="scss">
  .row {
    width: 100%;
    display: flex;

    .cell {
      width: var(--cellWidth);
      height: var(--cellHeight);
      background: rgba(120, 120, 120, 0.9);

      border: 0.5px solid rgba(0, 0, 0, 0.1);

      &[data-walkable="false"] {
        background: rgba(120, 120, 120, 0.72);
      }

      // &[data-cost="1"] {
      //   background: black;
      // }

      // &[data-cost="4"] {
      //   background: rgba(255, 255, 0, 0.5);
      // }

      // &[data-cost="10"] {
      //   background: rgba(255, 0, 0, 0.5);
      // }
    }
  }
</style>
