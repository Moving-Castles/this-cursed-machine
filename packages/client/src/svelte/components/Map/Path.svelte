<!-- Plots the planned course -->

<script lang="ts">
  import { fade } from "svelte/transition"
  import { onMount } from "svelte"
  import { EntityType } from "../../modules/state/types"
  import {
    NULL_COORDINATE,
    gameConfig,
    entities,
    playerCalculatedEnergy
  } from "../../modules/state"
  import { isCoordinate, manhattanPath } from "../../utils/space"
  import { config } from "../../modules/content/lore"
  import anime from "animejs/lib/anime.es.js"

  export let connection: Connection | boolean = false
  export let potential = false
  export let planned = false
  export let pathIndex = 1
  export let startCoord: Coord
  export let endCoord: Coord

  if (connection) {
    startCoord = $entities[connection.sourceEntity].position
    endCoord = $entities[connection.targetEntity].position
  }

  let localCoords: Coord[] = []
  let color = connection.type === EntityType.RESOURCE_CONNECTION ? "red" : "blue"
  let cost =
    connection.type === EntityType.RESOURCE_CONNECTION
      ? $gameConfig?.gameConfig.resourceConnectionCost
      : $gameConfig?.gameConfig.controlConnectionCost

  /**
   * Function that generates a SVG path string from an array of coordinates.
   * @param {Coord[]} coords - An array of coordinate objects. Each object should have 'x' and 'y' properties.
   * @return {string} A string representation of the SVG path.
   */
  const makeSvgPath = (coords: Coord[]) => {
    localCoords = coords
    // Initialize an empty string to hold the SVG path.
    let string = ""

    const canAfford = (i: number) => $playerCalculatedEnergy !== 0 && (i - 1) * cost <= $playerCalculatedEnergy
    const makePart = (i: number) => {
      let offsetX = $config.janky ? Math.floor(Math.random() * 10) - 5 : 0
      let offsetY = $config.janky ? Math.floor(Math.random() * 10) - 5 : 0
      // If it's the first coordinate, it is where the path starts.
      // We use 'M' (move to) followed by the coordinate to define the start point of the path.
      // We add 0.5 to center the path in the middle of the coordinate grid cell.
      if (i === 0) {
        string += `M${coords[i].x * 100 + 50 + offsetX} ${
          coords[i].y * 100 + 50 + offsetY
        }`
      } else {
        // For all other coordinates, we use 'L' (line to) followed by the coordinate to define a line from the current point to this coordinate.
        // We add 0.5 to center the path in the middle of the coordinate grid cell.
        string += `L${coords[i].x * 100 + 50 + offsetX} ${
          coords[i].y * 100 + 50 + offsetY
        }`
      }
    }

    // Check if the array of coordinates is not empty.
    if (coords.length > 0) {
      if (potential) {
        for (let i = 0; i < coords.length; i++) {
          if (canAfford(i)) makePart(i)
        }
      } else {
        for (let i = 0; i < coords.length; i++) {
          makePart(i)
        }
      }
    }
    // Return the SVG path string.
    return string
  }

  const path = makeSvgPath(manhattanPath(startCoord, endCoord))

  // If the path contains null coordinate do not draw them
  $: shouldDraw =
    !isCoordinate(startCoord, NULL_COORDINATE) &&
    !isCoordinate(endCoord, NULL_COORDINATE)

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

    g {
      transition: opacity 0.2s;
    }
  }

  .planned :global(*) {
    stroke: rgba(255, 255, 255, 0.5);
  }
</style>
