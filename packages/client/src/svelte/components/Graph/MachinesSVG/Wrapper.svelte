<script>
  import * as d3 from "d3"
  import { EntityType } from "../../../modules/state/enums"
  import { onMount } from "svelte"
  import { simulated } from "../../../modules/simulator"

  const MACHINE_SIZE = 100
  const PORT_SIZE = 20

  $: data = {
    nodes: [
      ...Object.entries($simulated)
        .map(([key, entry]) => ({
          id: key,
          entry,
          group: EntityType.MACHINE,
        }))
        .filter(({ entry }) => entry.entityType === EntityType.MACHINE),
      ...Object.entries($simulated)
        .map(([key, entry]) => ({
          id: key,
          entry,
          group: EntityType.PORT,
        }))
        .filter(({ entry }) => entry.entityType === EntityType.PORT),
    ],
    links: [
      // Connect ports to each other
      ...Object.entries($simulated)
        .map(([key, entry]) => ({
          id: key,
          entry,
          source: entry.sourcePort,
          target: entry.targetPort,
        }))
        .filter(({ entry }) => entry.entityType === EntityType.CONNECTION),
      // ... and attach ports to their machines
      ...Object.entries($simulated)
        .map(([key, entry]) => ({
          id: key,
          entry,
        }))
        .filter(({ entry }) => entry.entityType === EntityType.PORT)
        .map(obj => ({
          source: obj.entry.carriedBy,
          target: obj.id,
          entry: obj.entry,
        })),
    ],
  }

  $: console.log(data)

  let element // the parent container
  let interval // the interval used for animation

  // Specify the dimensions of the chart.
  let width = 928
  let height = 680

  let selection = []

  $: {
    if (selection.length === 2) {
      data.links.push({
        source: selection[0],
        target: selection[1],
        value: 200,
      })
      init()
      selection = []
    }
  }

  const init = () => {
    // Specify the color scale.
    const color = d3.scaleOrdinal(["rgba(0,0,0,0.8)"])

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
            d.source.group === EntityType.MACHINE ? 0 : MACHINE_SIZE * 2
          )
          .strength(d => (d.source.group === EntityType.MACHINE ? 2 : 0.1))
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

    // Add a line for each link, and a rectangle for each node.
    const link = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 1)
      .attr("stroke-dasharray", 30)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .selectAll("rect")
      .data(nodes)
      .join("rect")
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
      // .attr("transform-origin", "50 50")
      .attr("transform", d =>
        d.group === EntityType.MACHINE ? "rotate(0)" : "rotate(0)"
      )
      .attr("width", d =>
        d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
      )
      .attr("height", d =>
        d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
      )
      .attr("fill", d => color(d.group))

    node.append("title").text(d => EntityType[d.entry.entityType])

    node.on("mouseover", function (d) {
      if (!selection.includes(d.target.id)) {
        d3.select(this).transition().attr("fill", "#ff0000")
      }
    })

    node.on("mouseout", function (d) {
      if (!selection.includes(d.target.id)) {
        d3.select(this).transition().attr("fill", "rgba(0,0,0,0.8)")
      }
    })

    node.on("click", function (d) {
      selection = [...new Set([...selection, d.target.id])]
      d3.select(this).transition().attr("fill", "rgba(0,255,0,0.8)")
    })

    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
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
            ? 0
            : d.target.x - (MACHINE_SIZE - PORT_SIZE) / 2
        )
        .attr("y2", d =>
          d.target.group === EntityType.MACHINE
            ? 0
            : d.target.y - (MACHINE_SIZE - PORT_SIZE) / 2
        )

      // Used for positioning nodes
      node
        .attr("x", d => d.x - MACHINE_SIZE / 2)
        .attr("y", d => d.y - MACHINE_SIZE / 2)
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
      link.style("stroke-dashoffset", offset)
      offset += 4
    }, 120)
  }

  onMount(() => {
    init()
  })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div bind:this={element} />

<style>
  :global(rect:hover) {
    stroke: 4px solid blue;
  }
</style>
