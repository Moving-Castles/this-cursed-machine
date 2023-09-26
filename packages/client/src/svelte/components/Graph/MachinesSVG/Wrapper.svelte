<script>
  import * as d3 from "d3"
  import { EntityType, MachineType } from "../../../modules/state/enums"
  import { onMount } from "svelte"
  import {
    simulated,
    potential,
    simulatedPorts,
    simulatedConnections,
  } from "../../../modules/simulator"
  import _ from "lodash"
  import { ports } from "../../../modules/state"
  const { isEqual } = _

  const MACHINE_SIZE = 100
  const PORT_SIZE = 100

  let element // the parent container
  let interval // the interval used for animation

  // Specify the dimensions of the chart.
  let width = 0
  let height = 0

  let data = {}
  let previousData = {}

  $: {
    data = {
      nodes: [
        ...Object.entries($simulated)
          .map(([key, entry]) => ({
            id: key,
            entry,
            group: EntityType.MACHINE,
          }))
          .filter(({ entry }) => entry.entityType === EntityType.MACHINE),
      ],
      links: [
        // Connect ports to each other
        ...Object.entries($simulated)
          .map(([key, entry]) => ({
            id: key,
            entry,
          }))
          .filter(({ entry }) => entry.entityType === EntityType.CONNECTION)
          .map(({ id, entry }) => {
            // Connect the source machine to the target machine
            const sP = $simulatedPorts[entry.sourcePort]
            const tP = $simulatedPorts[entry.targetPort]

            return {
              id,
              entry,
              group: EntityType.CONNECTION,
              source: sP.carriedBy,
              target: tP.carriedBy,
            }
          }),
      ],
    }

    if (element && isEqual(data, previousData) === false) init() // update
    previousData = { ...data }
  }

  // Utilities
  const isConnected = d => {
    // If the connections contain ports that are connected to this machine, that means they are connected
    const machinePorts = Object.entries($simulatedPorts)
      .filter(([_, port]) => port.carriedBy === d.id)
      .map(([id, _]) => id)

    const connectionPorts = Object.values($simulatedConnections)
      .map(entry => [entry.sourcePort, entry.targetPort])
      .flat()

    return connectionPorts.some(item => machinePorts.includes(item))
  }

  const init = () => {
    // Specify the color scale.
    const color = d3.scaleOrdinal(["rgba(0,0,0,1)"])

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map(d => ({ ...d }))
    const nodes = data.nodes.map(d => ({ ...d }))

    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id(d => d.id)
          .distance(d =>
            d.source.group === EntityType.MACHINE
              ? MACHINE_SIZE * 2
              : MACHINE_SIZE * 2
          )
          .strength(d => (d.source.group === EntityType.MACHINE ? 1 : 1))
      )
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("x", d3.forceX())
      .force("y", d3.forceY())

    // Create the SVG container.
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;")

    // Links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#fff")
      .attr("stroke-dashoffset", 0)
      .attr("stroke-dasharray", 20)
      .attr("stroke-opacity", 0)
      .attr("id", d => `link-${d.id}`)
      .attr("stroke-width", d => Math.sqrt(d.value))

    const node = svg
      .append("g")
      .attr("class", "node")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("id", d => d.id)
      .attr("x", d =>
        d.group === EntityType.MACHINE
          ? d.x - MACHINE_SIZE / 2
          : d.x - MACHINE_SIZE / 2
      )
      .attr("y", d =>
        d.group === EntityType.MACHINE
          ? d.y - MACHINE_SIZE / 2
          : d.y - MACHINE_SIZE / 2
      )
      .attr("transform", d =>
        d.group === EntityType.MACHINE ? "rotate(0)" : "rotate(0)"
      )

    const rect = node
      .attr("fill", "#000")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .append("rect")
      .attr("width", d =>
        d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
      )
      .attr("height", d =>
        d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
      )
      .attr("fill", d => color(d.group))

    const labels = node
      .filter(d => d.group === EntityType.MACHINE)
      .append("text")
      .attr("font-size", "4rem")
      .attr("fill", "#fff")
      .attr("stroke", "none")
      .text(function (d) {
        if (d.entry.entityType === EntityType.MACHINE) {
          return `${MachineType[d.entry.machineType][0]}`
        }

        return EntityType[d.entry.entityType][0]
      })

    // Top right numbers
    const numbers = node
      .filter(d => d.group !== EntityType.PORT)
      .append("text")
      .attr("text-anchor", "end")
      .attr("font-size", "0.8rem")
      .attr("fill", "#fff")
      .attr("stroke", "none")
      .text(d => $simulated[d.id]?.numericalID)

    node.append("title").text(d => EntityType[d.entry.entityType])

    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", e => {
      // Used for position links
      link
        .attr("x1", d =>
          d.source.group === EntityType.PORT &&
          d.target.group === EntityType.PORT
            ? d.source.x - MACHINE_SIZE / 2
            : d.source.x
        )
        .attr("y1", d =>
          d.source.group === EntityType.PORT &&
          d.target.group === EntityType.PORT
            ? d.source.y - (MACHINE_SIZE - PORT_SIZE) / 2
            : d.source.y
        )
        .attr("x2", d =>
          d.target.group === EntityType.MACHINE
            ? d.target.x - (MACHINE_SIZE - PORT_SIZE) / 2
            : d.target.x - (MACHINE_SIZE - PORT_SIZE) / 2
        )
        .attr("y2", d =>
          d.target.group === EntityType.MACHINE
            ? d.target.y - (MACHINE_SIZE - PORT_SIZE) / 2
            : d.target.y - (MACHINE_SIZE - PORT_SIZE) / 2
        )
        .attr("z-index", 9999)
        .attr("stroke-opacity", d => {
          return d.source.group === EntityType.MACHINE ? 1 : 1
        })

      // Used for positioning nodes
      rect
        .attr("x", d => d.x - MACHINE_SIZE / 2)
        .attr("y", d => d.y - MACHINE_SIZE / 2)
      // Labels
      labels.attr("x", d => d.x - 17).attr("y", d => d.y + 17)
      // Numbers
      numbers.attr("x", d => d.x + 46).attr("y", d => d.y - 36)
      // Dash or no dash
      node
        .attr("stroke", d => {
          return isConnected(d) ? "#fff" : "#222"
        })
        .attr("stroke-dasharray", d => (isConnected(d) ? 20 : 0))
        .attr("stroke-opacity", d => 1)
    })

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    // invalidation.then(() => simulation.stop())

    element.prepend(svg.node())
    // element.appendChild(svg.node())

    // Animation station
    clearInterval(interval)
    // Updates the offset of dashes every 50ms:
    let offset = 1
    setInterval(function () {
      // Link is all the links
      link.attr("stroke-dashoffset", d => {
        // const linkElement = d3.select(`#link-${d.id}`)
        const linkElement = document.querySelector(`#link-${d.id}`)
        // Determine direction
        if (linkElement) {
          let dashOffset = Number(linkElement.getAttribute("stroke-dashoffset"))
          dashOffset -= 4
          return dashOffset
        }

        return 0
      })
      node.style("stroke-dashoffset", d => offset)

      offset += 4
    }, 120)
  }

  onMount(() => {
    init()
  })
</script>

<svelte:window on:resize={init} />

<div
  class="wrapper"
  bind:this={element}
  bind:clientWidth={width}
  bind:clientHeight={height}
/>

<style>
  :global(rect:hover) {
    stroke: 4px solid blue;
  }

  .wrapper {
    width: 100%;
    height: 100%;
  }
</style>
