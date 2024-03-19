<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  onMount(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch("requestDestroy")
  })
</script>

<div class="popover">
  <div class="text">FULLFILLED</div>
</div>

<style lang="scss">
  .popover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;

    .text {
      font-size: 200px;
      background: var(--color-active);
    }
  }
</style>
