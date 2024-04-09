<script lang="ts">
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import { depotAttachments } from "@modules/state/simulated/stores"
  import Attachment from "./Attachment.svelte"
  import { activeTab, graphElement } from "@svelte/modules/ui/stores"

  let [innerWidth, innerHeight] = [1, 1]
  let graphBoundingBox: SVGClientRect

  $: {
    if ($activeTab == 0) {
      graphBoundingBox = $graphElement?.getBoundingClientRect()
    }
  }
  $: graphBoundingBox = $graphElement?.getBoundingClientRect()

  $: console.log(graphBoundingBox)

  // Quick fix: only show when the first tab (pod) is active
  $: visible = $activeTab === 0

  onMount(async () => {
    console.log("mount")
  })
</script>

<svelte:window
  bind:innerWidth
  bind:innerHeight
  on:resize={() => (graphBoundingBox = $graphElement?.getBoundingClientRect())}
/>

{#key $activeTab}
  <svg
    in:fade={{ duration: 100 }}
    xmlns="http://www.w3.org/2000/svg"
    class="depot-connections"
    class:visible
    width={innerWidth}
    height={innerHeight}
    viewBox="0 0 {innerWidth} {innerHeight}"
  >
    <!-- Safe zone for attachment coordinates -->
    {#if $activeTab == 0}
      <rect
        id="midzone"
        x={Math.max(graphBoundingBox?.left + 200, 0) || 0}
        y={Math.max(graphBoundingBox?.top - 40, 0) || 0}
        width={graphBoundingBox?.width - 400 || 0}
        height={40}
        fill="none"
      />
      <rect
        id="safezone-1"
        x={Math.max(graphBoundingBox?.left - 100, 0) || 0}
        y={Math.max(graphBoundingBox?.top, 0) || 0}
        width={100}
        height={100}
        fill="none"
      />
      <rect
        id="safezone-2"
        x={Math.max(graphBoundingBox?.right, 0) || 0}
        y={Math.max(graphBoundingBox?.top, 0) || 0}
        width={100}
        height={100}
        fill="none"
      />

      {#each Object.entries($depotAttachments) as [address, attachment] (address)}
        <Attachment {attachment} />
      {/each}
    {/if}
  </svg>
{/key}

<style lang="scss">
  .depot-connections {
    position: fixed;
    pointer-events: none;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    clip-path: inset(122px 0px 0px 500px);

    &.visible {
      display: block;
    }
  }
</style>
