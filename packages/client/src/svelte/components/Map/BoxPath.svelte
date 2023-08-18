<script lang="ts">
  import { fade } from "svelte/transition"
  import { makeSvgPath } from "../../modules/ui/paths"

  export let coords: Coord[]
  export let potential = false
  export let planned = false

  let shouldDraw = true

  $: path = makeSvgPath(coords)
</script>

<!-- Reconstruct the Base map for SVG representation -->
{#if shouldDraw}
  <svg
    transition:fade
    class:potential
    class:planned
    style:z-index={planned ? 0 : 1}
    viewBox="0 0 400 400"
  >
    {#key path}
      <!-- Actual path -->
      <g fill="none" stroke={"red"} stroke-width={12} opacity="1">
        <path marker-end="url(#arrow-outline)" d={path} />
      </g>
    {/key}
  </svg>
{/if}

<style lang="scss">
  svg {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 99999;

    g {
      transition: opacity 0.2s;
    }
  }

  .planned :global(*) {
    stroke: rgba(255, 255, 255, 0.5);
  }
</style>
