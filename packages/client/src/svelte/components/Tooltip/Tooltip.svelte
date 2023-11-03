<script lang="ts">
  export let align: "center" | "left" | "right" = "center"
  import { onMount, onDestroy } from "svelte"

  let [h, x, y] = [0, 0, 0]

  let alignTransformation = ""

  $: {
    console.log(align)
    switch (align) {
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

  const onMouseMove = ({ clientX, clientY }) => {
    x = clientX
    y = clientY
  }

  onMount(() => {
    document.body.classList.add("cursor-none")
  })
  onDestroy(() => {
    document.body.classList.remove("cursor-none")
  })
</script>

<svelte:window bind:innerHeight={h} on:mousemove={onMouseMove} />

<!-- style:transform="translate(-50%, -20px) translate({x}px, {h - y}px)" -->
<div
  style:transform="translate({x}px, {-h + y}px) {alignTransformation}"
  class="box"
>
  <!-- in:fly={{ y: 20, duration: 60 }} -->
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
