<script lang="ts">
  import { fade } from "svelte/transition"
  import { makeSvgPath, makePolyline } from "../../modules/ui/paths"
  import { onMount } from "svelte"
  import anime from "animejs/lib/anime.es.js"

  export let i: number
  export let coords: Coord[]
  export let potential = false
  export let planned = false
  export let mode: "path" | "polyline" = "polyline"

  let shouldDraw = true
  let path = makeSvgPath(coords, i)
  let line = makePolyline(coords, i)
  let newPath: string
  let newLine: path = makeSvgPath(coords, i)

  $: {
    if (coords) {
      updateLine()
    }
  }

  const updateLine = () => {
    newLine = makePolyline(coords, i)
    anime({
      targets: `.polyline-${i}`,
      points: [{ value: line }, { value: newLine }],
      easing: "easeOutQuad",
      duration: 200,
      loop: false,
      begin: () => {
        console.log("beginngin the line")
      },
      complete: () => {
        line = newLine
        console.log("animated to: ", line)
      },
    })
  }

  onMount(updateLine)
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
    {#if mode === "path"}
      {#key path}
        <!-- Actual path -->
        <g
          fill="none"
          stroke={potential ? "grey" : "red"}
          stroke-width={6}
          opacity="1"
        >
          <path marker-end="url(#arrow-outline)" d={path} />
        </g>
      {/key}
    {:else}
      <polyline
        class="polyline-{i}"
        fill="none"
        stroke={potential ? "grey" : "red"}
        stroke-width={6}
      />
    {/if}
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

  path,
  :global(path) {
    transition: all 0.2s ease;
  }
</style>
