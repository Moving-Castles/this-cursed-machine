<script lang="ts">
  import { fly } from "svelte/transition"
  let [h, x, y] = [0, 0, 0]

  const onMouseMove = ({ clientX, clientY }) => {
    x = clientX
    y = clientY
  }
</script>

<svelte:window bind:innerHeight={h} on:mousemove={onMouseMove} />

<!-- style:transform="translate(-50%, -20px) translate({x}px, {h - y}px)" -->
<div
  style:transform="translate({x}px, {-h + y}px) translate(-50%, -20px)"
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
  }

  .inner {
    padding: 20px;
  }
</style>
