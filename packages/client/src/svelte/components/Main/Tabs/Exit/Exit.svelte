<script lang="ts">
  import { fade } from "svelte/transition"
</script>

<div class="container" in:fade>
  <div>EXIT</div>
</div>

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
