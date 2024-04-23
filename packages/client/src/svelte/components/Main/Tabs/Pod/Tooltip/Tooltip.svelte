<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { alignTooltip, mouseX, mouseY } from "@modules/ui/stores"

  let h = 0

  let alignTransformation = ""

  $: {
    switch ($alignTooltip) {
      case "left":
        alignTransformation = "translate(-20px, 50%)"
        break
      case "right":
        alignTransformation = "translate(-100%, 50%) translateX(20px)"
        break
      case "center":
        alignTransformation = "translate(-50%, 50%)"
        break
    }
  }

  onMount(() => {
    document.body.classList.add("cursor-none")
  })

  onDestroy(() => {
    document.body.classList.remove("cursor-none")
  })
</script>

<svelte:window bind:innerHeight={h} />

<div
  style:transform="translate({$mouseX}px, {-h + $mouseY}px) {alignTransformation}"
  class="box"
>
  <div class="inner">
    <slot />
  </div>
</div>

<style>
  .box {
    max-width: 32ch;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: var(--z-1);
    background-color: var(--color-grey-light) !important;
    border: 1px solid var(--background);
    pointer-events: none;
    cursor: none;
    font-size: var(--font-size-small);
    line-height: 1.2em;
    color: var(--background);
  }

  .inner {
    padding: 10px;
  }
</style>
