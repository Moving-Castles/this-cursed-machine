<script lang="ts">
  import { onMount } from "svelte"
  import { depotAttachments } from "@modules/state/simulated/stores"
  import Attachment from "./Attachment.svelte"
  import { activeTab } from "@svelte/modules/ui/stores"

  let [innerWidth, innerHeight] = [0, 0]

  let graphBoundingBox = null

  // Quick fix: only show when the first tab (pod) is active
  $: visible = $activeTab === 0

  const drawBBox = () => {
    const graph = document.getElementById("graph")
    graphBoundingBox = graph?.getBoundingClientRect()
  }

  onMount(drawBBox)
</script>

<svelte:window bind:innerWidth bind:innerHeight on:resize={drawBBox} />

<svg
  class="depot-connections"
  class:visible
  width={innerWidth}
  height={innerHeight}
  viewBox="0 0 {innerWidth} {innerHeight}"
>
  <!-- Draw an ellipse to avoid -->
  {#if graphBoundingBox}
    <!-- Safe zone for attachment coordinates -->
    <rect
      id="midzone"
      x={graphBoundingBox.left + 200}
      y={graphBoundingBox.top - 40}
      width={graphBoundingBox.width - 400}
      height={40}
      fill="none"
    />
    <rect
      id="safezone-1"
      x={graphBoundingBox.left - 100}
      y={graphBoundingBox.top}
      width={100}
      height={100}
      fill="none"
    />
    <rect
      id="safezone-2"
      x={graphBoundingBox.right}
      y={graphBoundingBox.top}
      width={100}
      height={100}
      fill="none"
    />
    <ellipse fill="none" stroke="none" />
  {/if}
  {#each $depotAttachments as attachment}
    <Attachment {attachment} />
  {/each}
</svg>

<style lang="scss">
  .depot-connections {
    position: absolute;
    pointer-events: none;
    /* background: rgba(0, 0, 255, 0.2); */
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;

    display: none;
    &.visible {
      display: block;
    }
  }
</style>
