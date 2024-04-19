<script lang="ts">
  import { fade } from "svelte/transition"
  import { tankAttachments } from "@modules/state/simulated/stores"
  import Attachment from "./Attachment.svelte"
  import { activeTab, graphElement } from "@modules/ui/stores"

  let [innerWidth, innerHeight] = [1, 1]
  let graphBoundingBox: DOMRect

  $: {
    if ($activeTab == 0) {
      graphBoundingBox = $graphElement?.getBoundingClientRect()
    }
  }
  $: graphBoundingBox = $graphElement?.getBoundingClientRect()

  // Quick fix: only show when the first tab (pod) is active
  $: visible = $activeTab === 0
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
    class="tank-connections"
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

      <defs>
        <mask id="mask">
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={graphBoundingBox?.left || 0}
            y={graphBoundingBox?.top + 100 || 0}
            width={graphBoundingBox?.width || 0}
            height={graphBoundingBox?.height - 200 || 0}
            fill="black"
          />
        </mask>
      </defs>

      <!-- Only shows inside -->
      <!-- <defs>
        <clipPath id="clip">
          <rect
            x={graphBoundingBox?.left || 0}
            y={graphBoundingBox?.top + 100 || 0}
            width={graphBoundingBox?.width || 0}
            height={graphBoundingBox?.height - 200 || 0}
          />
        </clipPath>
      </defs> -->

      {#each Object.entries($tankAttachments) as [address, attachment] (address)}
        <Attachment {attachment} />
      {/each}
    {/if}
  </svg>
{/key}

<style lang="scss">
  .tank-connections {
    position: fixed;
    pointer-events: none;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--z-1);
    clip-path: inset(122px 0px 0px 500px);

    &.visible {
      display: block;
    }
  }
</style>
