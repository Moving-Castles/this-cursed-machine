<script lang="ts">
  import { onMount } from "svelte"
  import Tooltip from "../../Tooltip/Tooltip.svelte"
  import { fade } from "svelte/transition"
  import ConnectionInformation from "../../Connections/ConnectionInformation.svelte"
  import MachineInformation from "../../Machines/MachineInformation.svelte"
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
  const chargeForce = d3.forceManyBody().strength(-800)
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
      Math.random() < 0.01 || simulation.tick()
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

      const ratioW = (parentW - MACHINE_SIZE) / w
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

  const inletOutletOrCore = d => {
    return (
      d.entry.machineType === MachineType.INLET ||
      d.entry.machineType === MachineType.OUTLET ||
      d.entry.machineType === MachineType.CORE
    )
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
      if (
        newNode.entry?.machineType === MachineType.INLET ||
        newNode.entry?.machineType === MachineType.OUTLET
      ) {
        newNode.fx =
          newNode.entry?.machineType === MachineType.INLET
            ? -width / 2 + MACHINE_SIZE
            : width / 2 - MACHINE_SIZE
        newNode.fy = 0 //newNode.entry?.machineType === MachineType.INLET ? -80 : 80
      }

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
      {#each links as link (link.id)}
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
          stroke-width={12}
          stroke-dasharray="1,7"
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
        <g out:fade class="node" id={d.id}>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          {#if d.entry.machineType !== MachineType.INLET && d.entry.machineType !== MachineType.OUTLET && d.entry.machineType !== MachineType.NONE}
            <rect
              x={d.x - MACHINE_SIZE / 2}
              y={d.y - MACHINE_SIZE / 2}
              width={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
              height={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
              fill="black"
            />
            <image
              class="{ConnectionState[
                machineState(d.address)
              ]} MACHINE_{MachineType[d.entry.machineType]}"
              x={d.x - MACHINE_SIZE / 2}
              y={d.y - MACHINE_SIZE / 2}
              width={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
              height={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
              href="/images/machines/{MachineType[d.entry.machineType]}.png"
            />
            <rect
              on:mouseenter={e => {
                onNodeOrConnectionMouseEnter(e, d.entry, d.address)
              }}
              on:mouseleave={() => (inspecting = null)}
              x={d.x - MACHINE_SIZE / 2}
              y={d.y - MACHINE_SIZE / 2}
              width={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
              height={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
              stroke={connectionState(d.entry) === ConnectionState.CONNECTED ||
              connectionState(d.entry) === ConnectionState.FLOWING
                ? "white"
                : "var(--STATE_INACTIVE)"}
              stroke-width="2"
              fill="transparent"
            />
          {:else if d.entry.machineType === MachineType.INLET || MachineType.OUTLET}
            <rect
              class="{ConnectionState[
                machineState(d.address)
              ]} MACHINE_{MachineType[d.entry.machineType]}"
              x={d.x - 20}
              y={d.y - 20}
              width={40}
              height={40}
              fill="var(--{$simulatedMachines[d.address]?.product?.materialType
                ? MaterialType[
                    $simulatedMachines[d.address]?.product?.materialType
                  ]
                : 'STATE_INACTIVE'})"
              stroke="white"
              stroke-width="2"
            />
          {/if}

          {#if d.entry.buildIndex}
            <rect
              fill="white"
              x={d.x + 16}
              y={d.y + 15}
              width="20"
              height="20"
            />
            <text fill="black" font-size="12px" x={d.x + 18} y={d.y + 30}>
              #{d.entry.buildIndex}
            </text>
          {/if}
          <!-- <title>{MachineType[d.entry.machineType]}</title> -->
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
    /* stroke: var(--STATE_INACTIVE); */
    stroke-dasharray: 8, 8; /* This should be at least the length of the longest path. */
    stroke-dashoffset: 80; /* Hide the line initially. */
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
      stroke: currentColor;
    }
  }

  .MACHINE_NONE {
    background-image: url("/images/machines/NONE.png");
  }
  .MACHINE_INLET {
    background-image: url("/images/machines/INLET.png");
  }
  .MACHINE_OUTLET {
    background-image: url("/images/machines/OUTLET.png");
  }
  .MACHINE_CORE {
    background-image: url("/images/machines/CORE.png");
  }
  .MACHINE_SPLITTER {
    background-image: url("/images/machines/SPLITTER.png");
  }
  .MACHINE_MIXER {
    background-image: url("/images/machines/MIXER.png");
  }
  .MACHINE_DRYER {
    background-image: url("/images/machines/DRYER.png");
  }
  .MACHINE_WETTER {
    background-image: url("/images/machines/WETTER.png");
  }
  .MACHINE_BOILER {
    background-image: url("/images/machines/BOILER.png");
  }
  .MACHINE_COOLER {
    background-image: url("/images/machines/COOLER.png");
  }
</style>
