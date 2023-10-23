<script>
  import { onMount } from "svelte"

  import { scaleLinear, scaleOrdinal } from "d3-scale"
  import { schemeCategory10 } from "d3-scale-chromatic"
  import { select, selectAll } from "d3-selection"
  import { drag } from "d3-drag"
  import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
  } from "d3-force"

  export let graph

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
  }

  let svg
  let width = 500
  let height = 600
  let nodes = graph.nodes
  let links = graph.links

  const padding = { top: 20, right: 40, bottom: 40, left: 25 }

  // $: nodeIdCounter = nodes && nodes.length ? nodes[nodes.length - 1].id + 1 : 1

  $: console.log(nodes.map(node => node.id))

  $: xScale = scaleLinear()
    .domain([0, 20])
    .range([padding.left, width - padding.right])

  $: yScale = scaleLinear()
    .domain([0, 12])
    .range([height - padding.bottom, padding.top])

  $: xTicks = width > 180 ? [0, 4, 8, 12, 16, 20] : [0, 10, 20]

  $: yTicks = height > 180 ? [0, 2, 4, 6, 8, 10, 12] : [0, 4, 8, 12]

  $: d3yScale = scaleLinear().domain([0, height]).range([height, 0])

  const colourScale = d3.scaleOrdinal(d3.schemeCategory10)

  function resize() {
    ;({ width, height } = svg.getBoundingClientRect())
  }

  const simulation = d3.forceSimulation(nodes)

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  function dragged(event) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  function dragsubject(event) {
    return simulation.find(event.x, event.y)
  }

  function addNode() {
    const newNode = {
      id: `Node ${nodes.length + 1}`,
      group: Math.floor(Math.random() * 10), // Random group for color. Adjust as necessary.
    }
    const newNode2 = {
      id: `Node2 ${nodes.length + 1}`,
      group: Math.floor(Math.random() * 10), // Random group for color. Adjust as necessary.
    }
    nodes = [...nodes, newNode, newNode2]
    simulation.nodes(nodes).restart()

    addLink(newNode.id, newNode2.id)
    addLink(newNode.id, "Napoleon")
    // if (nodes.find(node => node.id === `Node ${nodes.length}`)) {
    //   addLink(newNode.id, `Node ${nodes.length}`)
    // } else {
    // }
  }

  function addLink(source, target) {
    const newLink = { source, target, value: 0.1 }
    links = [...links, newLink]
    console.log(links)
    simulation.force("link").links(links)
    simulation.alpha(0.3).restart()
  }

  $: {
    simulation
      .force(
        "link",
        d3.forceLink(links).id(d => {
          return d.id || d
        })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", function ticked() {
        simulation.tick()
        nodes = [...nodes]
        links = [...links]
      })
    d3.select(svg).call(
      d3
        .drag()
        .container(svg)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
  }
</script>

<button on:click={addNode}>Add node</button>

<svelte:window on:resize={resize} />

<svg bind:this={svg}>
  {#each links as link}
    <g stroke="#999" stroke-opacity="0.6">
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

  {#each nodes as point (point.id)}
    <circle
      class="node"
      r="5"
      fill={colourScale(point.group)}
      cx={point.x}
      cy={d3yScale(point.y)}
      transform="translate(0 {height}) scale(1 -1)"
    >
      <title>{point.id}</title></circle
    >
  {/each}
</svg>

<style>
  svg {
    width: 100%;
    height: 100%;
    float: left;
  }

  circle {
    stroke: #fff;
    stroke-width: 1.5;
  }

  .tick line {
    stroke: #ddd;
    stroke-dasharray: 2;
  }

  text {
    font-size: 12px;
    fill: #999;
  }

  .x-axis text {
    text-anchor: middle;
  }

  .y-axis text {
    text-anchor: end;
  }
</style>
