<script lang="ts">
  import type { Discovery } from "."
  import {
    podOutputs,
    discoveredMaterials,
  } from "@modules/state/simulated/stores"
  import { discover, discoveries } from "."
  import DiscoveryComponent from "./Discovery.svelte"
  import { linear } from "svelte/easing"
  import { flip } from "svelte/animate"

  const onEnd = (e: CustomEvent<Discovery>) => {
    discoveries.set(
      $discoveries.filter((t: Discovery) => t.timestamp !== e.detail.timestamp),
    )
  }

  $: {
    $podOutputs.forEach(output => {
      if (!$discoveredMaterials.includes(output.materialId)) {
        discover(output)
      }
    })
  }
</script>

<div class="discovery-pane">
  {#each $discoveries as discovery (discovery.materialId + discovery.timestamp)}
    <div animate:flip={{ duration: 100, easing: linear }}>
      <DiscoveryComponent {discovery} on:end={onEnd} />
    </div>
  {/each}
</div>

<style>
  .discovery-pane {
    position: absolute;
    z-index: var(--z-10);
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column-reverse;
    width: 330px;
    text-align: center;
  }
</style>
