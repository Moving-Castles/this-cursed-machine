<script lang="ts">
  import { circularLayout } from "../../modules/ui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  
  const close = () => dispatch("close")
</script>

<div class="tile-actions" use:circularLayout>
  <button class="action" on:click|stopPropagation={close}> Close </button>

  <slot />
</div>

<style>
  .tile-actions {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>