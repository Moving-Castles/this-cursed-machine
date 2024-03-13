<script lang="ts">
  import { fade } from "svelte/transition"
  import { player } from "@modules/state/base/stores"
</script>

<div class="container" in:fade>
  <div>EXIT</div>
  <div>POINTS: {$player.tokenBalances ?? 0}</div>
  <div>COMPLETED ORDERS: {$player.completed?.length ?? 0}</div>
</div>

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
