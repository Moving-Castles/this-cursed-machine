<script lang="ts">
  import { GRID } from "../constants"
</script>

{#each Array(GRID.HEIGHT) as _}
  <div class="row">
    {#each Array(GRID.WIDTH) as _}
      <div class="cell"></div>
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
      // background: white;
      // border: 0.5px solid grey;
    }
  }
</style>
