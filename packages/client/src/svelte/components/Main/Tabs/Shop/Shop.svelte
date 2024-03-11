<script lang="ts">
  import { fade } from "svelte/transition"
  import { buy } from "@modules/action"

  function sendBuy() {
    buy()
  }
</script>

<div class="container" in:fade>SHOP</div>

<div>
  <button on:click={() => sendBuy()}>Buy</button>
</div>

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
