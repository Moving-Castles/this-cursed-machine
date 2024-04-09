<script lang="ts">
  import { onMount, tick } from "svelte"
  import { fade } from "svelte/transition"
  import { depotAttachments } from "@modules/state/simulated/stores"
  import Attachment from "./Attachment.svelte"
  import { activeTab } from "@svelte/modules/ui/stores"

  let [innerWidth, innerHeight] = [0, 0]

  let graphBoundingBox = null

  // Quick fix: only show when the first tab (pod) is active
  $: visible = $activeTab === 0

  $: if (visible) drawBBox()

  const drawBBox = () => {
    const graph = document.getElementById("graph")
    graphBoundingBox = graph?.getBoundingClientRect()
  }

  onMount(async () => {
    await tick()
    drawBBox()
    // Wait for the transition to complete or it will mess with placement
    setTimeout(drawBBox, 100)
  })
</script>

<svelte:window bind:innerWidth bind:innerHeight on:resize={drawBBox} />

{#if graphBoundingBox}
  {#key graphBoundingBox.x}
    <svg
      in:fade={{ duration: 100 }}
      class="depot-connections"
      class:visible
      width={innerWidth}
      height={innerHeight}
      viewBox="0 0 {innerWidth} {innerHeight}"
    >
      <!-- Safe zone for attachment coordinates -->
      <rect
        id="midzone"
        x={Math.max(graphBoundingBox.left + 200, 0)}
        y={Math.max(graphBoundingBox.top - 40, 0)}
        width={graphBoundingBox.width - 400}
        height={40}
        fill="none"
      />
      <rect
        id="safezone-1"
        x={Math.max(graphBoundingBox.left - 100, 0)}
        y={Math.max(graphBoundingBox.top, 0)}
        width={100}
        height={100}
        fill="none"
      />
      <rect
        id="safezone-2"
        x={Math.max(graphBoundingBox.right, 0)}
        y={Math.max(graphBoundingBox.top, 0)}
        width={100}
        height={100}
        fill="none"
      />
      <ellipse fill="none" stroke="none" />
      {#each Object.entries($depotAttachments) as [address, attachment] (address)}
        a
        <Attachment {attachment} />
      {/each}
    </svg>
  {/key}
{/if}

<style lang="scss">
  .depot-connections {
    position: fixed;
    pointer-events: none;
    /* background: rgba(0, 0, 255, 0.2); */
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    display: none;
    clip-path: inset(122px 0px 0px 500px);

    &.visible {
      display: block;
    }
  }
</style>
