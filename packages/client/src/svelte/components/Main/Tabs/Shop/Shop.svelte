<script lang="ts">
  import { player, offers } from "@modules/state/base/stores"
  import { tutorialProgress } from "@svelte/modules/ui/assistant"
  import ShopItem from "./ShopItem.svelte"
  import Certificate from "./Certificate.svelte"
</script>

<div class="container">
  <div>SHOP</div>
  <div class="offer-list">
    {#each Object.entries($offers) as [key, offer]}
      <ShopItem {key} {offer} />
    {/each}
    {#if $player?.tutorialLevel === 3}
      <Certificate />
    {/if}
  </div>
</div>

<style lang="scss">
  .container {
    padding: 20px;

    .offer-list {
      margin-top: 40px;
      display: flex;
    }
  }
</style>
