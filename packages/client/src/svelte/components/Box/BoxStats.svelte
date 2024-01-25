<script lang="ts">
  // import { playerEntity, playerBox } from "../../modules/state"
  import { simulatedPlayerEntity } from "../../modules/simulator"
  import Stats from "../../components/Box/Warehouse/Stats.svelte"
  import { showLevelModal } from "../../modules/ui/stores"
  import { playerEntity } from "../../modules/state"
</script>

<div class="box-stats">
  <!-- RIGHT COLUMN -->
  <div class="column">
    <p>Stump #{$playerEntity.spawnIndex}</p>
    <p class="muted">************</p>
  </div>

  <!-- LEFT COLUMN -->
  <div class="column">
    <p class="muted">IN PROGRESS</p>
    <p class="muted">*****************</p>
    <p>TODO!!!</p>
    <!-- {#if !$showLevelModal}
      <p>
        {#key $playerEntity.level}
          <Stats />
        {/key}
      </p>
    {/if} -->
  </div>
</div>

<style lang="scss">
  .box-stats {
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
    margin: 0;
    padding: var(--default-padding);
    overflow: scroll;
    text-align: left;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    overflow-y: auto;

    .column {
      width: 50%;
      height: 100%;
    }
  }

  .muted {
    color: #ccc;
  }

  .green {
    color: var(--color-success);
  }

  .PISS {
    color: yellow;
  }
</style>
