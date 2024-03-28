<script lang="ts">
  import { offers } from "@modules/state/base/stores"
  import ShopItem from "./ShopItem.svelte"
  import Certificate from "./Certificate.svelte"
</script>

<div class="container">
  <div>SHOP</div>
  <div class="offer-list">
    {#each Object.entries($offers) as [key, offer]}
      <ShopItem {key} {offer} />
    {/each}
    <Certificate />
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
