<script lang="ts">
  // import { playerCore, playerBox } from "../../modules/state"
  import { onWheel } from "../../modules/ui/events"
  import { MaterialType } from "../../modules/state/enums"
  import {
    simulatedPlayerCore,
    simulatedPlayerEnergy,
    boxOutput,
  } from "../../modules/simulator"
  import { playerCore } from "../../modules/state"
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box-stats" use:onWheel>
  <!-- RIGHT COLUMN -->
  <div class="column">
    <p>Worker#24 (Level {$playerCore.level})</p>
    <p class="muted">-------------------</p>
    <p>
      {#key $simulatedPlayerCore.energy}
        <span class="green">ENERGY:{$simulatedPlayerEnergy}</span>
      {/key}
    </p>
  </div>

  <!-- LEFT COLUMN -->
  <div class="column">
    <p class="muted">Produced materials:</p>
    <p class="muted">-------------------</p>
    <p>
      {#if Object.entries($boxOutput).length > 0}
        {#each Object.entries($boxOutput) as [type, amount] (type)}
          <span class={MaterialType[type]}>
            {MaterialType[type].split("_").join(" ")}: {amount}
          </span><br />
        {/each}
      {/if}
    </p>
  </div>
</div>

<style lang="scss">
  .box-stats {
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
    margin: 0;
    padding: 0.5rem;
    overflow: scroll;
    text-align: left;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .column {
      width: 50%;
      height: 100%;
    }
  }

  .energy {
    font-size: 8rem;
    letter-spacing: -1rem;
    color: black;
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
