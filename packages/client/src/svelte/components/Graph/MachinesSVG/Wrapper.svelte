<script>
  import * as d3 from "d3"
  import { onMount } from "svelte"

  $: data = {
    nodes: [
      { id: "1", group: 1 },
      { id: "2", group: 1 },
      { id: "3", group: 2 },
      { id: "4", group: 3 },
      { id: "5", group: 3 },
      { id: "6", group: 3 },
      { id: "7", group: 3 },
      { id: "8", group: 3 },
      { id: "9", group: 3 },
      { id: "10", group: 3 },
      { id: "11", group: 3 },
      { id: "12", group: 3 },
      { id: "13", group: 3 },
      { id: "14", group: 3 },
      { id: "15", group: 3 },
      { id: "16", group: 3 },
      { id: "17", group: 3 },
    ],
    links: [],
  }

  let element // the parent container
  let interval // the interval used for animation

  // Specify the dimensions of the chart.
  let width = 928
  let height = 680

  let selection = []

  $: {
    if (selection.length === 2) {
      console.log(selection)
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
          .distance(function (d) {
            // return d.distance
            return 500
          })
          .strength(2)
      )
      .force("charge", d3.forceManyBody().strength(-500))
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
      .attr("stroke-dasharray", 1.5)
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
      .attr("x", d => d.x - 50)
      .attr("y", d => d.y - 50)
      .attr("width", 100)
      .attr("height", 100)
      .attr("fill", d => color(d.group))

    node.append("title").text(d => d.id)

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
      // Not used, is for circles
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

      node.attr("cx", d => d.x).attr("cy", d => d.y)

      node.attr("x", d => d.x - 50).attr("y", d => d.y - 50)
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
