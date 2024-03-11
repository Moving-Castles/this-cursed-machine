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
      background: rgba(255, 255, 255, 0.4);
      border: 0.5px solid rgba(0, 0, 0, 0.1);
    }
  }
</style>
