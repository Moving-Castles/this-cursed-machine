<script lang="ts">
  import { onWheel } from "../../modules/ui/events"
  import { simulatedPlayerCore } from "../../modules/simulator"
  import { blocksSinceLastResolution } from "../../modules/simulator/"
  import { capAtZero } from "../../modules/utils/misc"

  export let box: Box
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box-stats" use:onWheel>
  <p>
    <span class="muted">Energy:</span><br />
    {#key $simulatedPlayerCore.energy}
      <span class="energy flash-a-bit text-stroke">
        {capAtZero(
          ($simulatedPlayerCore.energy || 0) - $blocksSinceLastResolution
        )}
      </span>
    {/key}
  </p>
</div>

<style>
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
</style>
