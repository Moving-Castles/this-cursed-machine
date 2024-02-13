<script lang="ts">
  import { graphState } from "./graphState"
  import { GRID } from "./constants"
  import type { GraphState } from "./types"

  let currentGraphState: GraphState

  graphState.subscribe(newGraphState => {
    currentGraphState = newGraphState
  })
</script>

<div class="graph">
  <div class="grid">
    <div class="top"></div>
    {#each Array(GRID.HEIGHT) as _, _}
      <div class="row">
        {#each Array(GRID.WIDTH) as _, _}
          <div class="cell"></div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .graph {
    background: orangered;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .grid {
      position: relative;

      .top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 0, 0.5);
      }

      .row {
        width: 100%;
        display: flex;

        .cell {
          width: 55px;
          height: 55px;
          background: white;
          border: 0.5px solid grey;
        }
      }
    }
  }
</style>
