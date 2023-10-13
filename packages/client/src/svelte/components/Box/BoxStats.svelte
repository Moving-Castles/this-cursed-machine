<script lang="ts">
  // import { playerCore, playerBox } from "../../modules/state"
  import { onWheel } from "../../modules/ui/events"
  import {  MaterialType } from "../../modules/state/enums"
  import {
    simulatedPlayerCore,
    simulatedPlayerEnergy,
    boxOutput,
  } from "../../modules/simulator"
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box-stats" use:onWheel>
  <p>Worker#24</p>
  <p class="muted">-------------------</p>
  <p>
    {#key $simulatedPlayerCore.energy}
      <span class="green">ENERGY:{$simulatedPlayerEnergy}</span>
    {/key}
  </p>
  <p class="muted">-------------------</p>
  <p class="muted">Produced materials:</p>
  <p>
    {#if Object.entries($boxOutput).length > 0}
      {#each Object.entries($boxOutput) as [type, amount] (type)}
        <span>
          {MaterialType[type]}:
          <span class={MaterialType[type]}>
            {amount}
          </span>
        </span><br />
      {/each}
    {/if}
  </p>
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
    flex-flow: column nowrap;
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
