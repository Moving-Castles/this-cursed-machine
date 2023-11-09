<script lang="ts">
  import Connection from "./Connections/Connection.svelte"
  import Machine from "./Machines/Machine.svelte"
  import MaterialGradients from "./MaterialGradients/MaterialGradients.svelte"

  import { onMount } from "svelte"
  import { draw, fade } from "svelte/transition"
  import { range } from "../../modules/utils/misc"
  import {
    EntityType,
    MaterialType,
    ConnectionState,
  } from "../../modules/state/enums"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "../../modules/simulator"
  import {
    connectionState,
    machineState,
  } from "../../modules/state/convenience"
  import { inspecting, alignTooltip } from "../../modules/ui/stores"
  import { MachineType } from "../../modules/state/types"
  import { scaleLinear, scaleOrdinal } from "d3-scale"
  import { schemeCategory10 } from "d3-scale-chromatic"
  import { select, selectAll } from "d3-selection"
  import { drag } from "d3-drag"
  import { MACHINE_SIZE, data, x1, y1, x2, y2 } from "./Machines/index"
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
    $alignTooltip = "center"
    if (entry.entityType === EntityType.MACHINE) {
      if (entry.machineType === MachineType.INLET) $alignTooltip = "left"
      if (entry.machineType === MachineType.OUTLET) $alignTooltip = "right"
    }

    $inspecting = { ...entry, address: a }
  }

  const distributeGaps = (node, dashSize = 20) => {
    // Calculate the total length of the path
    const totalLength = node.getTotalLength()

    // Calculate the number of dashes that can fit into the path
    const dashCount = Math.floor(totalLength / (dashSize * 2))

    // Calculate the size of the gaps to distribute the remaining space
    const gapSize = (totalLength - dashSize * dashCount) / dashCount

    // Apply the stroke-dasharray
    node.setAttribute("stroke-dasharray", `${dashSize} ${gapSize}`)

    // Cleanup function
    return {
      destroy() {
        // Remove the stroke-dasharray when the element is destroyed
        node.removeAttribute("stroke-dasharray")
      },
    }
  }

  const groupScale = node => {
    let scale = 1
    const check = () => {
      node.style.transform = ""
      const { width: w, height: h } = node.getBoundingClientRect()
      const { width: parentW, height: parentH } = svg.getBoundingClientRect()

      const ratioW = (parentW - MACHINE_SIZE) / w
      const ratioH = (parentH - MACHINE_SIZE) / h

      const newScale = Math.min(ratioW, ratioH)

      if (scale - newScale > 0.1 || newScale - scale <= -0.1) {
        node.style.transform = `scale(${newScale})`
      }
      scale = newScale
    }
    let tickscale = setInterval(check)
    return {
      destroy() {
        clearInterval(tickscale)
      },
    }
  }

  const linkColor = entry => {
    if (entry?.product) {
      return `var(--${
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
    const graph = data($simulatedMachines, $simulatedConnections)

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

<div class="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <svg
    bind:this={svg}
    style:width="{width}px"
    style:height="{height}px"
    viewBox={[-width / 2, -height / 2, width, height]}
  >
    <MaterialGradients />

    <g use:groupScale class="all-nodes">
      <!-- LINKS -->
      {#each links as link (link.id)}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <g
          on:mouseenter={e => {
            onNodeOrConnectionMouseEnter(e, link.entry, link.address)
          }}
          on:mouseleave={() => ($inspecting = null)}
          class="machine-connection {ConnectionState[
            connectionState(link.entry)
          ]}"
          style:color={linkColor(link.entry)}
        >
          <Connection
            d={`M ${x1(links, link)} ${y1(links, link, d3yScale)} L ${x2(
              links,
              link
            )} ${y2(links, link, d3yScale)}`}
            state={connectionState(link.entry)}
            stroke={linkColor(link.entry)}
            transform="translate(0 {height}) scale(1 -1)"
          />
        </g>
      {/each}
      <!-- END LINKS -->

      <!-- NODES -->
      {#each nodes as node (node.id)}
        <g
          out:fade
          class="node {ConnectionState[
            machineState(node.address)
          ]} {MachineType[node.entry.machineType]}"
          id={node.id}
        >
          <Machine
            on:mouseenter={e => {
              onNodeOrConnectionMouseEnter(e, node.entry, node.address)
            }}
            on:mouseleave={() => ($inspecting = null)}
            {MACHINE_SIZE}
            d={node}
            state={machineState(node.address)}
          />
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

  .node-image.FLOWING {
    /* animation: flowAnimation 1s ease forwards infinite; */
  }
  .machine-connection.FLOWING,
  .machine-connection.FLOWING path {
    /* animation: flowAnimation 1s ease forwards infinite; */
  }

  path {
    /* transition: stroke 0.3s ease; */
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

  @keyframes rotateAnimation {
    0% {
      transform: rotate(-12deg);
    }
    100% {
      transform: rotate(12deg);
    }
  }

  svg :global(.node),
  svg :global(.node-image),
  svg :global(.rect),
  svg :global(.node-rect) {
    transform-origin: center; /* or transform-origin: 50% */
    transform-box: fill-box;
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
    background-image: url("/images/machines/CORE4.png");
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
