<script lang="ts">
  import { onMount } from "svelte"
  import Tooltip from "../../Tooltip/Tooltip.svelte"
  import { draw, fade } from "svelte/transition"
  import { range } from "../../../modules/utils/misc"
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

  let align = "center"
  let svg
  let width = 0
  let height = 0
  let inspecting = null

  let [nodes, links] = [[], []]

  // Initialize forces
  const linkForce = d3
    .forceLink()
    .id(d => d.id || d)
    .distance(MACHINE_SIZE * 2.5)
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

  const onNodeOrConnectionMouseEnter = (e, entry, a) => {
    align = "center"
    if (entry.entityType === EntityType.MACHINE) {
      if (entry.machineType === MachineType.INLET) align = "left"
      if (entry.machineType === MachineType.OUTLET) align = "right"
    }

    console.log("ALIGN: ", align)
    inspecting = { ...entry, address: a }
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

  const linkColor = entry => {
    if (entry?.inputs) {
      return `var(--${
        entry.product?.materialType
          ? MaterialType[entry.product?.materialType]
          : "STATE_INACTIVE"
      })`
    } else {
      return "var(--STATE_INACTIVE)"
    }
  }

  const linkGradient = entry => {
    if (entry?.inputs) {
      return `url(#gradient-${
        entry.product?.materialType
          ? MaterialType[entry.product?.materialType]
          : "STATE_INACTIVE"
      })`
    } else {
      return "var(--STATE_INACTIVE)"
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
    // Distance should be a function of the amount of nodes in the network, with the max being 3 machines wide, and min 1 machine wide.
    linkForce
      .links(links)
      .distance(range(3, 30, MACHINE_SIZE * 3, MACHINE_SIZE, nodes.length))
    simulation.alpha(1).restart()
  }

  // GO ON THEN
  onMount(resize)
</script>

<svelte:window on:resize={resize} />

{#if inspecting}
  <Tooltip {align}>
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
    <defs>
      {#each Object.keys(MaterialType).filter(t => typeof parseInt(t) === "number") as type}
        <linearGradient
          id="gradient-{MaterialType[type]}"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stop-color="var(--{MaterialType[type]})" />
          <stop offset="100%" stop-color="var(--STATE_INACTIVE)" />
        </linearGradient>
      {/each}
    </defs>
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
          style:color={linkColor(link.entry)}
        >
          <path
            class="path"
            in:draw={{ duration: 700 }}
            out:draw={{ duration: 300 }}
            d={`M ${x1(links, link)} ${y1(links, link, d3yScale)} L ${x2(
              links,
              link
            )} ${y2(links, link, d3yScale)}`}
            fill="none"
            stroke={linkColor(link.entry)}
            transform="translate(0 {height}) scale(1 -1)"
          />
        </g>
      {/each}
      <!-- END LINKS -->

      <!-- NODES -->
      {#each nodes as d (d.id)}
        <g
          out:fade
          class="node {ConnectionState[machineState(d.address)]} {MachineType[
            d.entry.machineType
          ]}"
          style:animation-delay="{Math.random() * -10}s"
          id={d.id}
        >
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
              on:mouseenter={e => {
                onNodeOrConnectionMouseEnter(e, d.entry, d.address)
              }}
              on:mouseleave={() => (inspecting = null)}
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

  .machine-connection,
  .machine-connection :global(path) {
    stroke-dasharray: 20, 1; /* This should be at least the length of the longest path. */
    stroke-dashoffset: 80; /* Hide the line initially. */
    stroke-opacity: 1;
    stroke-width: 12;
    stroke-linecap: "round";
  }

  .machine-connection.FLOWING,
  .machine-connection.FLOWING path {
    animation: flowAnimation 1s ease forwards infinite;
  }

  path {
    transition: stroke 0.3s ease;
  }

  @keyframes vibrate {
    0% {
      transform: translate(0, 0);
    }
    2.5% {
      transform: translate(0, -2px);
    } /* Up */
    5% {
      transform: translate(2px, -2px);
    } /* Right */
    7.5% {
      transform: translate(2px, 0);
    } /* Down */
    10% {
      transform: translate(2px, 2px);
    } /* Down */
    12.5% {
      transform: translate(0px, 2px);
    } /* Left */
    15% {
      transform: translate(-2px, 2px);
    } /* Left */
    17.5% {
      transform: translate(-2px, 0);
    } /* Up */
    20% {
      transform: translate(-2px, -2px);
    } /* Up */
    22.5% {
      transform: translate(0px, -2px);
    } /* Right */
    25% {
      transform: translate(2px, -2px);
    } /* Down */
    27.5% {
      transform: translate(2px, 0);
    } /* Right */
    30% {
      transform: translate(2px, 2px);
    } /* Down */
    32.5% {
      transform: translate(0px, 2px);
    } /* Left */
    35% {
      transform: translate(-2px, 2px);
    } /* Left */
    37.5% {
      transform: translate(-2px, 0);
    } /* Up */
    40% {
      transform: translate(-2px, -2px);
    } /* Up */
    42.5% {
      transform: translate(0px, -2px);
    } /* Right */
    45% {
      transform: translate(2px, -2px);
    } /* Right */
    47.5% {
      transform: translate(2px, 0);
    } /* Down */
    50% {
      transform: translate(2px, 2px);
    } /* Left */
    52.5% {
      transform: translate(0px, 2px);
    } /* Down */
    55% {
      transform: translate(-2px, 2px);
    } /* Left */
    57.5% {
      transform: translate(-2px, 0);
    } /* Up */
    60% {
      transform: translate(-2px, -2px);
    } /* Up */
    62.5% {
      transform: translate(0px, -2px);
    } /* Right */
    65% {
      transform: translate(2px, -2px);
    } /* Right */
    67.5% {
      transform: translate(2px, 0);
    } /* Down */
    70% {
      transform: translate(2px, 2px);
    } /* Down */
    72.5% {
      transform: translate(0px, 2px);
    } /* Left */
    75% {
      transform: translate(-2px, 2px);
    } /* Up */
    77.5% {
      transform: translate(-2px, 0);
    } /* Left */
    80% {
      transform: translate(-2px, -2px);
    } /* Up */
    82.5% {
      transform: translate(0px, -2px);
    } /* Right */
    85% {
      transform: translate(2px, -2px);
    } /* Right */
    87.5% {
      transform: translate(2px, 0);
    } /* Down */
    90% {
      transform: translate(2px, 2px);
    } /* Down */
    92.5% {
      transform: translate(0px, 2px);
    } /* Left */
    95% {
      transform: translate(-2px, 2px);
    } /* Left */
    97.5% {
      transform: translate(-2px, 0);
    } /* Up */
    100% {
      transform: translate(0, 0);
    } /* Right */
  }
  @keyframes flowAnimation {
    to {
      stroke-dashoffset: 0; /* Reveal the line. */
    }
  }

  .node {
    transition: filter 1s ease;
    filter: grayscale(1) brightness(0.2) contrast(0.5);
  }

  .node.CONNECTED {
    filter: grayscale(0) brightness(1) contrast(1);
  }

  .node.FLOWING {
    filter: grayscale(0) brightness(1) contrast(1);
  }

  .node:not(.INLET):not(.OUTLET).FLOWING {
    animation: vibrate 4s infinite;
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
