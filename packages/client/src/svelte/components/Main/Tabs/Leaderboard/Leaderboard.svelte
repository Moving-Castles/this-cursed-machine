<script lang="ts">
  import { fade } from "svelte/transition"
  import { players } from "@modules/state/base/stores"
</script>

<div class="container" in:fade>
  <div>LEADERBOARD</div>

  {#each Object.entries($players) as [id, player]}
    {#if player.tokenBalances}
      <div>
        {player.name} - {player.tokenBalances}
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
