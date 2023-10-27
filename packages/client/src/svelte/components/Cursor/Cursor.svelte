<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { writable } from "svelte/store"
  export let bare = true

  export let offset = 25

  export let [mouseX, mouseY] = [0, 0]

  let coords = writable({ x: mouseX, y: mouseY })
  // let scale = spring(1.5, { stiffness: 0.2, damping: 0.8 })

  let style = `transform: translate(${$coords.x}px, ${$coords.y}px)`

  $: style = `transform: translate(${$coords.x}px, ${$coords.y}px) translate(-50%, -50%)`

  const onMouseMove = (e: MouseEvent) => {
    console.log(mouseX, mouseY)
    mouseX = e.clientX
    mouseY = e.clientY
    coords.set({ x: mouseX, y: mouseY })
  }

  onMount(() => {
    if (bare) {
      document.body.classList.add("cursor-none")
    }
  })
  onDestroy(() => {
    if (bare) {
      document.body.classList.remove("cursor-none")
    }
  })
</script>

<svelte:window on:mousemove={onMouseMove} />

<div class="blink-if-you-see-me" {style}>
  <slot />
</div>

<style>
  .blink-if-you-see-me {
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
