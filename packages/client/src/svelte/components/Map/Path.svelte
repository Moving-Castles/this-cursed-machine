<!-- Plots the planned course -->

<script lang="ts">
  import { fade } from "svelte/transition"
  import { onMount } from "svelte"
  import { EntityType } from "../../modules/state/enums"
  import {
    NULL_COORDINATE,
    gameConfig,
    entities,
    playerCalculatedEnergy,
  } from "../../modules/state"
  import { sameCoordinate, aStarPath } from "../../modules/utils/space"
  import { makeSvgPath } from "../../modules/ui/paths"
  // import { config } from "../../modules/content/lore"
  import anime from "animejs/lib/anime.es.js"

  export let connection: Connection | boolean = false
  export let address = ""

  export let potential = false
  export let planned = false
  export let pathIndex = 1

  // OPTIONAL
  export let startCoord: Coord = NULL_COORDINATE
  export let endCoord: Coord = NULL_COORDINATE

  let color = ""
  let cost = 0
  let localCoords: Coord[] = []
  let path: string

  const colorMappings = {
    2: "red",
    3: "blue",
  }

  if (connection) {
    startCoord = $entities[connection.sourceEntity].position
    endCoord = $entities[connection.targetEntity].position
    color = colorMappings[connection.type]
    cost =
      connection.type === EntityType.RESOURCE_CONNECTION
        ? $gameConfig?.resourceConnectionCost
        : $gameConfig?.controlConnectionCost
  }

  const makePath = () => {
    const coords = aStarPath(startCoord, endCoord)
    localCoords = coords
    path = makeSvgPath(coords, 0)
  }

  makePath()

  // If the path contains null coordinate do not draw them
  $: shouldDraw =
    !sameCoordinate(startCoord, NULL_COORDINATE) &&
    !sameCoordinate(endCoord, NULL_COORDINATE)

  onMount(() => {
    anime({
      targets: "#path",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: `steps(${localCoords.length * 3})`,
      duration: 1500,
      direction: "forward",
      loop: true,
    })
  })
</script>

{#if shouldDraw}
  <svg
    transition:fade
    class:potential
    class:planned
    style:z-index={planned ? 0 : pathIndex + 1}
    viewBox="0 0 400 400"
  >
    {#key path}
      <!-- Actual path -->
      <g
        fill="none"
        stroke={color}
        stroke-width={planned
          ? 14
          : connection.type === EntityType.RESOURCE_CONNECTION
          ? 10
          : 6}
        opacity="1"
      >
        <path marker-end="url(#arrow-outline)" d={path} />
      </g>
      {#if !potential && !planned}
        <!-- Path overlay -->
        <g
          fill="none"
          stroke={color}
          stroke-width={planned
            ? 14
            : connection.type === EntityType.RESOURCE_CONNECTION
            ? 10
            : 6}
          opacity="1"
        >
          <path
            id="path"
            marker-end="url(#arrow-outline)"
            d={path}
            dasharray=""
          />
        </g>
      {/if}
    {/key}
    <!-- stroke-dasharray={connection.type === EntityType.RESOURCE_CONNECTION ? 2 : 1} -->
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
