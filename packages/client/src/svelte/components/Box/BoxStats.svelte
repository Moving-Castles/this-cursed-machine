<script lang="ts">
  import { playerCore, playerBox } from "../../modules/state"
  import { onWheel } from "../../modules/ui/events"
  import { simulatedPlayerCore } from "../../modules/simulator"
  import { blocksSinceLastResolution } from "../../modules/simulator/"
  import { capAtZero } from "../../modules/utils/misc"
  import { coreIsConnectedToInlet } from "../../modules/simulator/"
  import { blockNumber } from "../../modules/network/"

  $: console.log("$coreIsConnectedToInlet ", $coreIsConnectedToInlet)

  // If we are not connected to inlet energy is:
  // Energy = on-chain energy - blocksSinceLastResolution
  // If we are connected to inlet energy is:
  // Energy = on-chain energy + blocksSinceLastResolution
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box-stats" use:onWheel>
  <p>
    <span class="muted">Energy:</span><br />
    {#key $simulatedPlayerCore.energy}
      <div>
        On-chain: {$playerCore.energy}
      </div>
      <div class="green">
        Simulated: {capAtZero(
          ($simulatedPlayerCore.energy || 0) +
            ($coreIsConnectedToInlet ? 1 : -1) * $blocksSinceLastResolution
        )}
      </div>
      <div>
        Mod: {$coreIsConnectedToInlet ? 1 : -1}
      </div>
      <div>
        Past blocks: {$blocksSinceLastResolution}
      </div>
      <div>
        Last resolved: {$playerBox.lastResolved}
      </div>
      <div>
        Current block: {$blockNumber}
      </div>
    {/key}
  </p>
</div>

<style lang="scss">
  .box-stats {
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
    margin: 0;
    padding: 1rem;
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
</style>
