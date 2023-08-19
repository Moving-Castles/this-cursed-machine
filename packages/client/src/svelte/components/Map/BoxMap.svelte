<script lang="ts">
  import { onMount } from "svelte"
  import { explainer } from "../../modules/content/wiki"
  import { initGrid } from "../../modules/utils/space"
  import { connections } from "../../modules/state"
  import { paths, plannedPath } from "../../modules/ui/paths"
  import type { GridTile } from "./index"
  import Tile from "./Tile.svelte"
  import Explainer from "../Explainer/Explainer.svelte"
  import BoxPath from "./BoxPath.svelte"

  export let width: number
  export let height: number

  let w: number
  let h: number
  let grid: GridTile[] = []

  onMount(() => {
    grid = initGrid(width, height)
  })
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<div
  class="ui-map"
  style="--map-width: {width * 100}px; --map-height: {height * 100}px;"
>
  <div
    class="map-container"
    style:width="{width * 100}px"
    style:height="{height * 100}px"
  >
    {#each grid as tile (tile.id)}
      <Tile {tile} />
    {/each}

    <!-- SVG Layer -->
    <svg viewBox="0 0 {width * 100} {width * 100}">
      {#each $paths as path, i}
        <BoxPath {path} {i} />
      {/each}

      {#if $plannedPath}
        <BoxPath potential path={$plannedPath} i={0} />
      {/if}
    </svg>

    {#if $explainer !== ""}
      <Explainer />
    {/if}
  </div>
</div>

<div class="ui-connections debug">
  {#each Object.entries($connections) as [_, connection], i (connection)}
    <!-- {address}: {connection} -->
    <!-- <Connection {connection} /> -->
  {/each}
</div>

<style lang="scss">
  .ui-connections {
    position: fixed;
    bottom: 0;
    background: black;
    z-index: 999;
    color: white;
  }
  .ui-map {
    height: 100dvh;
    width: 100dvw;
    overflow: auto;
    padding: 0;
    position: relative;

    .map-container {
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 99999;
  }
</style>
