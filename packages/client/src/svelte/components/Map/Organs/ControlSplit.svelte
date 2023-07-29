<script lang="ts">
  export let entity: EntityStoreEntry
  import {
    playerCore,
  } from "../../../modules/state"
  import {
    vote,
  } from "../../../modules/action"

  function sendVote() {
    vote()
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if $playerCore.controlConnection === entity.address}
  {#if !$playerCore.voted}
    <button class="action" on:click={sendVote}>Vote</button>
  {/if}
{/if}