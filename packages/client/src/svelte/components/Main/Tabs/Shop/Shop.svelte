<script lang="ts">
  import { offers } from "@modules/state/base/stores"
  import OfferItem from "./OfferItem.svelte"
</script>

<div class="container">
  <div>OFFERS</div>
  <div class="offer-list">
    {#each Object.entries($offers) as [key, offer]}
      <OfferItem {key} {offer} />
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    padding: 20px;

    .offer-list {
      margin-top: 40px;
    }
  }
</style>
