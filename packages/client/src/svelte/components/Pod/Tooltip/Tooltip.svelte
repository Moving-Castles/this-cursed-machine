<script lang="ts">
  import { alignTooltip, mouseX, mouseY } from "../../../modules/ui/stores"
  import { onMount, onDestroy } from "svelte"

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
    width: 32ch;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background-color: black !important;
    border: 1px solid white;
    pointer-events: none;
    cursor: none;
  }

  .inner {
    padding: 20px;
  }
</style>
