<script lang="ts">
  import type { Discovery } from "."
  import {
    podOutputs,
    discoveredMaterials,
  } from "@modules/state/simulated/stores"
  import { showMaterialIndex } from "@modules/ui/stores"
  import { materialMetadata } from "@modules/state/base/stores"
  import { discover, discoveries } from "."
  import { flicker } from "@modules/ui/transitions"
  import { fly } from "svelte/transition"
  import { linear } from "svelte/easing"
  import { flip } from "svelte/animate"

  import DiscoveryComponent from "./Discovery.svelte"
  import DiscoveryHighlight from "./Highlight.svelte"

  const onEnd = (e: CustomEvent<Discovery>) => {
    discoveries.set(
      $discoveries.filter((t: Discovery) => t.timestamp !== e.detail.timestamp)
    )
  }

  const onKeyDown = e => {
    if (e.key !== "Escape") return

    showMaterialIndex.set(false)
  }

  let materials = $discoveredMaterials.map(id => $materialMetadata?.[id])
  let highlighting: Discovery | null = null

  $: if ($showMaterialIndex)
    materials = $discoveredMaterials.map(id => $materialMetadata?.[id])
  $: key =
    $discoveries.map(d => d.materialId).join("") + $discoveredMaterials.join("")
  $: if ($discoveries) {
    materials = $discoveredMaterials.map(id => $materialMetadata?.[id])
  }
  const highlightMaterial = (discovery: Discovery) => {
    highlighting = discovery
  }

  $: {
    $podOutputs.forEach(output => {
      if (!$discoveredMaterials.includes(output.materialId)) {
        discover(output)
      }
    })
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="discovery-pane" class:index={$showMaterialIndex}>
  {#if $showMaterialIndex}
    <div transition:fly={{ x: 400 }} class="inner-wrapper">
      <div class="inner closed">
        {#key key}
          {#each materials as discovery (discovery._id)}
            <div>
              <DiscoveryComponent
                on:click={() => highlightMaterial(discovery)}
                displayOnly
                {discovery}
              />
            </div>
          {/each}
        {/key}
      </div>
      {#if highlighting}
        {#key highlighting._id}
          <div class="highlighting">
            <div class="highlighting-inner" in:flicker={{ duration: 300 }}>
              <DiscoveryHighlight
                on:click={() => {
                  highlighting = null
                  $showMaterialIndex = false
                }}
                discovery={highlighting}
              />
            </div>
          </div>
        {/key}
      {/if}
    </div>
  {:else}
    <div class="inner">
      {#each $discoveries as discovery (discovery.materialId + discovery.timestamp)}
        <div animate:flip={{ duration: 100, easing: linear }}>
          <DiscoveryComponent {discovery} on:end={onEnd} />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .discovery-pane {
    position: fixed;
    z-index: var(--z-10);
    top: 0;
    right: 0;
    width: auto;
    text-align: center;
    height: 100vh;
    display: flex;
    flex-flow: row nowrap;

    &:not(.index) {
      top: 110px;
      height: auto;
    }

    .inner-wrapper {
      display: flex;
      flex-flow: row nowrap;
    }

    .inner {
      padding: 1rem;
      display: flex;
      flex-direction: column-reverse;
      gap: var(--font-size-small);

      &.closed {
        background-color: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        border-left: var(--default-border-style);
        overflow-x: hidden;
        overflow-y: scroll;
        height: 100vh;
      }
    }

    .highlighting {
      width: 400px;
      position: relative;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      border-left: var(--default-border-style);

      &.highlighting-inner {
        // opacity: 0.4;
      }
    }
  }
</style>
