<script lang="ts">
  export let entity: EntityStoreEntry
  import {
    PORTAL_ID,
    playerCore,
    calculatedEnergy,
    playerEntityId,
    portal
  } from "../../../modules/state"
  import { chargePortal, exit } from "../../../modules/action"


  function sendChargePortal() {
    chargePortal(PORTAL_ID)
  }

  function sendExit() {
    exit(PORTAL_ID)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->


{#if $playerCore.resourceConnection === entity.address}
  <button disabled={$calculatedEnergy[$playerEntityId] < 100} class="action" on:click={sendChargePortal}>Charge (+100 Energy)</button>
{/if}

{#if $playerCore.controlConnection === entity.address}
  <button disabled={$portal.energy < 200} class="action" on:click={sendExit}>Exit body (-200 Energy)</button>
{/if}