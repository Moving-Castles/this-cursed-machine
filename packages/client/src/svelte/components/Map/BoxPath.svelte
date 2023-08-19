<script lang="ts">
  import { fade } from "svelte/transition"
  import { makeSvgPath, makePolyline } from "../../modules/ui/paths"
  import { onMount } from "svelte"
  import anime from "animejs/lib/anime.es.js"

  export let i: number
  export let path: PathDefinition
  export let potential = false
  export let planned = false
  export let mode: "path" | "polyline" = "polyline"

  let shouldDraw = true
  let svgPath = makeSvgPath(path.coords, i)
  let line = makePolyline(path.coords, i)
  let newPath: string
  let newLine: path = makeSvgPath(path.coords, i)

  $: {
    if (path.coords) {
      updateLine()
    }
  }

  const updateLine = (initial = false) => {
    const { startEntity, endEntity, sourcePort, targetPort } = path
    if (startEntity && endEntity && sourcePort && targetPort) {
      newLine = makePolyline(
        path.coords,
        i,
        startEntity,
        endEntity,
        sourcePort,
        targetPort
      )
    } else {
      newLine = makePolyline(path.coords, i)
    }
    anime({
      targets: `.polyline-${i}`,
      points: [{ value: line }, { value: newLine }],
      easing: "easeInOutCubic",
      duration: initial ? 0 : 200,
      loop: false,
      begin: () => {
        // console.log("beginngin the line")
      },
      complete: () => {
        line = newLine
        // console.log("animated to: ", line)
      },
    })
  }

  onMount(() => updateLine(true))
</script>

<!-- Reconstruct the Base map for SVG representation -->
{#if shouldDraw}
  {#if mode === "path"}
    {#key svgPath}
      <!-- Actual path -->
      <g
        class:potential
        class:planned
        fill="none"
        stroke={potential ? "grey" : "red"}
        stroke-width={6}
        opacity="1"
      >
        <path marker-end="url(#arrow-outline)" d={svgPath} />
      </g>
    {/key}
  {:else}
    <polyline
      class="polyline polyline-{i}"
      class:potential
      class:planned
      fill="none"
      stroke={potential ? "grey" : "red"}
      stroke-width={6}
    />
  {/if}
{/if}

<style lang="scss">
  .polyline {
    pointer-events: auto !important;
    &:hover {
      stroke: blue !important;
    }
  }

  .planned :global(*) {
    stroke: rgba(255, 255, 255, 0.5);
  }

  path,
  :global(path) {
    transition: all 0.2s easeInOutCubic;
  }
</style>
