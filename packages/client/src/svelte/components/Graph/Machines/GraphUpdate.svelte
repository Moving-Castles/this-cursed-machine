<script lang="ts">
  import { onMount } from "svelte"
  import Tooltip from "../../Tooltip/Tooltip.svelte"
  import MachineInformation from "../../Machines/MachineInformation.svelte"
  import ConnectionInformation from "../../Connections/ConnectionInformation.svelte"
  import {
    EntityType,
    MaterialType,
    ConnectionState,
  } from "../../../modules/state/enums"
  import {
    simulatedMachines,
    simulatedConnections,
    simulatedPorts,
  } from "../../../modules/simulator"
  import {
    connectionState,
    machineState,
  } from "../../../modules/state/convenience"
  import { MachineType } from "../../../modules/state/types"
  import { scaleLinear, scaleOrdinal } from "d3-scale"
  import { schemeCategory10 } from "d3-scale-chromatic"
  import { select, selectAll } from "d3-selection"
  import { drag } from "d3-drag"
  import { MACHINE_SIZE, data, x1, y1, x2, y2 } from "./index"
  import { zoom } from "d3-zoom"
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
    zoom,
  }

  let svg
  let width = 0
  let height = 0
  let inspecting = null

  let [nodes, links] = [[], []]

  // Initialize forces
  const linkForce = d3
    .forceLink()
    .id(d => d.id || d)
    .distance(MACHINE_SIZE * 2)
  const chargeForce = d3.forceManyBody().strength(-1000)
  const xForce = d3.forceX()
  const yForce = d3.forceY()

  function resize() {
    ;({ width, height } = svg.getBoundingClientRect())
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", linkForce)
    .force("charge", chargeForce)
    .force("x", xForce)
    .force("y", yForce)
    .on("tick", function ticked() {
      simulation.tick()
      nodes = [...nodes]
      links = [...links]
    })

  const onNodeOrConnectionMouseEnter = (e, d, a) => {
    inspecting = { ...d, address: a }
  }

  const groupScale = node => {
    const check = () => {
      node.style.transform = ""
      const { width: w, height: h } = node.getBoundingClientRect()
      const { width: parentW, height: parentH } = svg.getBoundingClientRect()

      const ratioW = (parentW - MACHINE_SIZE * 2) / w
      const ratioH = (parentH - MACHINE_SIZE) / h

      node.style.transform = `scale(${Math.min(ratioW, ratioH)})`
    }
    let tickscale = setInterval(check)
    return {
      destroy() {
        clearInterval(tickscale)
      },
    }
  }

  $: d3yScale = scaleLinear().domain([0, height]).range([height, 0])

  $: {
    const graph = data(
      $simulatedMachines,
      $simulatedConnections,
      $simulatedPorts
    )

    // Update nodes
    graph.nodes.forEach(newNode => {
      const existingNode = nodes.find(node => node.id === newNode.id)
      if (existingNode) {
        Object.assign(existingNode, newNode) // Update existing node
      } else {
        nodes.push(newNode) // Add new node
      }
    })

    // Remove nodes that no longer exist
    nodes = nodes.filter(node =>
      graph.nodes.some(newNode => newNode.id === node.id)
    )

    // Update links
    graph.links.forEach(newLink => {
      const existingLink = links.find(link => link.id === newLink.id)
      if (existingLink) {
        Object.assign(existingLink, newLink) // Update existing link
      } else {
        links.push(newLink) // Add new link
      }
    })

    // Remove links that no longer exist
    links = links.filter(link =>
      graph.links.some(newLink => newLink.id === link.id)
    )

    // Update simulation with new nodes and links
    simulation.nodes(nodes)
    linkForce.links(links)
    simulation.alpha(1).restart()
  }

  // GO ON THEN
  onMount(resize)
</script>

<svelte:window on:resize={resize} />

{#if inspecting}
  <Tooltip>
    {#if inspecting?.entityType === EntityType.MACHINE}
      <MachineInformation address={inspecting.address} machine={inspecting} />
    {/if}
    {#if inspecting?.entityType === EntityType.CONNECTION}
      <ConnectionInformation
        address={inspecting.address}
        connection={inspecting}
      />
    {/if}
  </Tooltip>
{/if}

<div class="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <svg
    bind:this={svg}
    style:width="{width}px"
    style:height="{height}px"
    viewBox={[-width / 2, -height / 2, width, height]}
  >
    <g use:groupScale class="all-nodes">
      <!-- LINKS -->
      {#each links as link}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <g
          on:mouseenter={e => {
            onNodeOrConnectionMouseEnter(e, link.entry, link.address)
          }}
          on:mouseleave={() => (inspecting = null)}
          class="machine-connection {ConnectionState[
            connectionState(link.entry)
          ]}"
          stroke="var(--{link.entry?.product?.materialType
            ? MaterialType[link.entry?.product?.materialType]
            : 'STATE_INACTIVE'})"
          stroke-opacity="1"
          stroke-width={14}
          stroke-dasharray="1,9"
          stroke-linecap="round"
        >
          <line
            x1={x1(links, link)}
            y1={y1(links, link, d3yScale)}
            x2={x2(links, link)}
            y2={y2(links, link, d3yScale)}
            transform="translate(0 {height}) scale(1 -1)"
          >
            <title>{link.source.id}</title>
          </line>
        </g>
      {/each}
      <!-- END LINKS -->

      <!-- NODES -->
      {#each nodes as d (d.id)}
        <g class="node" id={d.id}>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <rect
            on:mouseenter={e => {
              onNodeOrConnectionMouseEnter(e, d.entry, d.address)
            }}
            on:mouseleave={() => (inspecting = null)}
            class={ConnectionState[machineState(d.address)]}
            x={d.x - MACHINE_SIZE / 2}
            y={d.y - MACHINE_SIZE / 2}
            width={MACHINE_SIZE}
            height={MACHINE_SIZE}
            fill="black"
            stroke="white"
          />
          {#if d.entry.machineType !== MachineType.CORE}
            <text
              class="machine-text {ConnectionState[machineState(d.address)]}"
              fill="white"
              font-size="30px"
              x={d.x - 10}
              y={d.y + 10}>{MachineType[d.entry.machineType][0]}</text
            >
          {:else}
            <text
              class="machine-text {ConnectionState[machineState(d.address)]}"
              fill="white"
              font-size="30px"
              x={d.x - 30}
              y={d.y + 10}>YOU</text
            >
          {/if}

          {#if d.entry.buildIndex}
            <text fill="white" font-size="12px" x={d.x + 10} y={d.y + 10}>
              #{d.entry.buildIndex}
            </text>
          {/if}
          <title>{MachineType[d.entry.machineType]}</title>
        </g>
      {/each}
      <!-- END NODES -->
    </g>
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

  .machine-text {
    pointer-events: none;
  }

  .machine-connection.FLOWING {
    stroke: var(--STATE_INACTIVE);
    stroke-dasharray: 1000; /* This should be at least the length of the longest path. */
    stroke-dashoffset: 1000; /* Hide the line initially. */
    animation: flowAnimation 1s forwards, colorChangeAnimation 1s forwards;
  }

  @keyframes flowAnimation {
    to {
      stroke-dashoffset: 0; /* Reveal the line. */
    }
  }

  @keyframes colorChangeAnimation {
    from {
      stroke: var(--STATE_INACTIVE);
    }
    to {
      stroke: var(
        --STATE_ACTIVE
      ); /* Change to whatever active color you want. */
    }
  }
</style>
