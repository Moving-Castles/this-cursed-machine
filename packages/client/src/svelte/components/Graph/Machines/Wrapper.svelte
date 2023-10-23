<script>
  import { onMount } from "svelte"
  import {
    simulatedMachines,
    simulatedConnections,
    simulatedPorts,
  } from "../../../modules/simulator"
  import { MachineType } from "../../../modules/state/types"
  import { scaleLinear, scaleOrdinal } from "d3-scale"
  import { schemeCategory10 } from "d3-scale-chromatic"
  import { select, selectAll } from "d3-selection"
  import { drag } from "d3-drag"
  import { data } from "./index"
  import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceX,
    forceY,
  } from "d3-force"

  let d3 = {
    scaleLinear,
    scaleOrdinal,
    schemeCategory10,
    select,
    selectAll,
    drag,
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceX,
    forceY,
  }

  let svg
  let width = 500
  let height = 600

  const MACHINE_SIZE = 100

  let [nodes, links] = [[], []]

  const colourScale = d3.scaleOrdinal(d3.schemeCategory10)

  function resize() {
    ;({ width, height } = svg.getBoundingClientRect())
  }

  const simulation = d3.forceSimulation(nodes)

  $: {
    const graph = data(
      $simulatedMachines,
      $simulatedConnections,
      $simulatedPorts
    )
    nodes = [...graph.nodes].map(d => {
      if (
        d.entry?.machineType === MachineType.INLET ||
        d.entry?.machineType === MachineType.OUTLET
      ) {
        d.fx =
          d.entry?.machineType === MachineType.INLET
            ? -width / 2 + MACHINE_SIZE
            : width / 2 - MACHINE_SIZE
        d.fy = 0
      }

      return d
    })
    links = [...graph.links]
    simulation.alpha(1).restart()
  }

  $: d3xScale = scaleLinear().domain([width, 0]).range([0, width])
  $: d3yScale = scaleLinear().domain([0, height]).range([height, 0])

  $: {
    simulation
      .nodes(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id(d => {
            return d.id || d
          })
          .distance(MACHINE_SIZE * 2)
      )
      .force("charge", d3.forceManyBody().strength(-2000))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", function ticked() {
        simulation.tick()
        nodes = [...nodes]
        links = [...links]
      })
  }

  onMount(resize)
</script>

<svelte:window on:resize={resize} />

<div class="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <svg
    style:width="{width}px"
    style:height="{height}px"
    bind:this={svg}
    viewBox={[-width / 2, -height / 2, width, height]}
  >
    {#each links as link}
      <g stroke="white" stroke-opacity="1" stroke-width={10}>
        <line
          x1={link.source.x}
          y1={d3yScale(link.source.y)}
          x2={link.target.x}
          y2={d3yScale(link.target.y)}
          transform="translate(0 {height}) scale(1 -1)"
        >
          <title>{link.source.id}</title>
        </line>
      </g>
    {/each}

    {#each nodes as d (d.id)}
      <g class="node" id={d.id}>
        <rect
          x={d.x - MACHINE_SIZE / 2}
          y={d.y - MACHINE_SIZE / 2}
          width={MACHINE_SIZE}
          height={MACHINE_SIZE}
          fill="black"
          stroke="white"
        />
        <text fill="white" font-size="30px" x={d.x - 10} y={d.y + 10}
          >{MachineType[d.entry.machineType][0]}</text
        >
        <title>{MachineType[d.entry.machineType]}</title>
      </g>
    {/each}
  </svg>
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
    max-width: 100%;
    float: left;
  }
</style>
