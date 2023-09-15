<script>
  import { onMount } from "svelte"
  import { scaleLinear, scaleOrdinal } from "d3-scale"
  import { zoom, zoomIdentity } from "d3-zoom"
  import { schemeCategory10 } from "d3-scale-chromatic"
  import { select, selectAll, pointer } from "d3-selection"
  import { drag } from "d3-drag"
  import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
  } from "d3-force"
  import { simulated } from "../../../modules/simulator"
  import { entities } from "../../../modules/state"

  // TODO: Add font
  // https://stackoverflow.com/questions/21025876/using-google-fonts-with-d3-js-and-svg

  //import { event as currentEvent } from "d3-selection"; // Needed to get drag working, see: https://github.com/d3/d3/issues/2733
  let d3 = {
    zoom,
    zoomIdentity,
    scaleLinear,
    scaleOrdinal,
    schemeCategory10,
    select,
    selectAll,
    pointer,
    drag,
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
  }

  const graph = {
    nodes: [
      { id: "machine", group: 1 },
      { id: "core", group: 1 },
    ],
    links: [{ source: "machine", target: "core", value: 10, label: "" }],
  }

  let canvas
  let width = 500
  let height = 600
  let max = 100
  const nodeRadius = 50
  let activeNode = false
  const padding = { top: 0, right: 0, bottom: 0, left: 0 }

  $: xScale = scaleLinear()
    .domain([0, 20])
    .range([padding.left, width - padding.right])

  $: yScale = scaleLinear()
    .domain([0, 12])
    .range([height - padding.bottom, padding.top])

  $: xTicks = width > 180 ? [0, 4, 8, 12, 16, 20] : [0, 10, 20]

  $: yTicks = height > 180 ? [0, 2, 4, 6, 8, 10, 12] : [0, 4, 8, 12]

  $: d3yScale = scaleLinear().domain([0, height]).range([height, 0])

  $: links = graph.links.map(d => Object.create(d))
  $: nodes = graph.nodes.map(d => {
    console.log(d)
    d.size = Math.pow(
      graph.links
        .filter(link => link.source == d.id || link.target == d.id)
        .map(link => link.value)
        .reduce((a, b) => a + b),
      2
    )
    if (d.id == "You") {
      max = d.size
      d.details.messages = max
    }
    return Object.create(d)
  })

  function groupColour(context, d) {
    console.log(d)
    let nodesize = 2 + Math.sqrt(d.size) / 5
    let radgrad = context.createRadialGradient(
      d.x,
      d.y,
      nodesize / 3,
      d.x,
      d.y,
      nodesize
    )
    radgrad.addColorStop(0, "#01abfc")
    radgrad.addColorStop(0.1, "#01abfc")
    radgrad.addColorStop(1, "#01abfc00")

    let radgrad2 = context.createRadialGradient(
      d.x,
      d.y,
      nodesize / 3,
      d.x,
      d.y,
      nodesize
    )
    radgrad2.addColorStop(0, "#7A17F6")
    radgrad2.addColorStop(0.1, "#7A17F6")
    radgrad2.addColorStop(1, "#7A17F600")

    let radgrad3 = context.createRadialGradient(
      d.x,
      d.y,
      nodesize / 3,
      d.x,
      d.y,
      nodesize
    )
    radgrad3.addColorStop(0, "#B635E3")
    radgrad3.addColorStop(0.1, "#B635E3")
    radgrad3.addColorStop(1, "#B635E300")

    let radgrad4 = context.createRadialGradient(
      d.x,
      d.y,
      nodesize / 3,
      d.x,
      d.y,
      nodesize
    )
    radgrad4.addColorStop(0, "#E4158B")
    radgrad4.addColorStop(0.1, "#E4158B")
    radgrad4.addColorStop(1, "#E4158B00")

    let radgrad5 = context.createRadialGradient(
      d.x,
      d.y,
      nodesize / 3,
      d.x,
      d.y,
      nodesize
    )
    radgrad4.addColorStop(0, "#F9123B")
    radgrad4.addColorStop(0.1, "#F9123B")
    radgrad4.addColorStop(1, "#F9123B00")
    let radgrads = [radgrad, radgrad2, radgrad3, radgrad4, radgrad5]
    return radgrads[d.group % 5]
  }
  let showCard
  let transform = d3.zoomIdentity
  let simulation, context
  let dpi = 1

  onMount(() => {
    dpi = window.devicePixelRatio || 1
    context = canvas.getContext("2d")
    resize()

    simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id(d => d.id)
          .distance(
            d => 2 + Math.sqrt(max) / 4 + 130 * Math.pow(2, -d.value / 1000)
          )
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      //.force('collision', d3.forceCollide().radius((d) => Math.sqrt(d.size)/4))
      .on("tick", simulationUpdate)

    // title
    d3.select(context.canvas).on("mousemove", event => {
      const d = simulation.find(
        transform.invertX(event.offsetX * dpi),
        transform.invertY(event.offsetY * dpi),
        50
      )

      if (d) activeNode = d
      else activeNode = false
    })

    d3.select(context.canvas).on("click", () => {
      if (activeNode) {
        showCard = JSON.parse(
          JSON.stringify({ id: activeNode.id, details: activeNode.details })
        )
      }
    })

    d3.select(canvas)
      .call(
        d3
          .drag()
          .container(canvas)
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 10, 8])
          .on("zoom", zoomed)
      )
  })

  function simulationUpdate() {
    const randomSeed = Math.random()
    context.save()
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.translate(transform.x, transform.y)
    context.scale(transform.k, transform.k)

    function linkArc(d) {
      var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy)
      return [d.source.x, d.source.y, d.target.x, d.target.y, dr]
    }

    links.forEach((d, j) => {
      context.fillStyle = "#f00"

      const middleX =
        Math.min(d.source.x, d.target.x) +
        (Math.max(d.source.x, d.target.x) - Math.min(d.source.x, d.target.x)) /
          2
      const middleY =
        Math.min(d.source.y, d.target.y) +
        (Math.max(d.source.y, d.target.y) - Math.min(d.source.y, d.target.y)) /
          2

      d.label
        .split(/(?=[A-Z])/)
        .forEach((word, index) =>
          context.fillText(word, middleX, middleY + 10 * index + 10)
        )
      // context.fillStyle = "transparent"
      // var grad = context.createLinearGradient(50, 50, 150, 150)
      // grad.addColorStop(0, "red")
      // grad.addColorStop(1, "green")
      context.beginPath()
      context.moveTo(d.source.x, d.source.y)
      context.lineTo(d.target.x, d.target.y)
      // context.arcTo(d.source.x, d.source.y, d.target.x, d.target.y, 1)
      context.globalAlpha = 1
      context.strokeStyle = "#ff0"
      context.lineWidth = Math.cbrt(d.value) / 2
      context.stroke()
      context.globalAlpha = 1
      context.fill()
    })

    nodes.forEach((d, i) => {
      context.beginPath()
      context.arc(d.x, d.y, 2 + Math.sqrt(d.size) / 5, 1, 2 * Math.PI)
      context.strokeStyle = "transparent"
      context.lineWidth = 1.5
      context.stroke()
      context.fillStyle = groupColour(context, d)
      context.fill()
      // if (d.size > max / 50) {
      context.fillStyle = "white"
      d.id
        .split(/(?=[A-Z])/)
        .forEach((word, index) =>
          context.fillText(word, d.x - 10, d.y + 10 * index)
        )
      // }
    })
    context.restore()
  }

  function zoomed(currentEvent) {
    transform = currentEvent.transform
    simulationUpdate()
  }

  // Use the d3-force simulation to locate the node
  function dragsubject(currentEvent) {
    const node = simulation.find(
      transform.invertX(currentEvent.x * dpi),
      transform.invertY(currentEvent.y * dpi),
      50
    )
    if (node) {
      node.x = transform.applyX(node.x)
      node.y = transform.applyY(node.y)
    }
    return node
  }

  function dragstarted(currentEvent) {
    if (!currentEvent.active) simulation.alphaTarget(0.3).restart()
    currentEvent.subject.fx = transform.invertX(currentEvent.subject.x)
    currentEvent.subject.fy = transform.invertY(currentEvent.subject.y)
  }

  function dragged(currentEvent) {
    currentEvent.subject.fx = transform.invertX(currentEvent.x)
    currentEvent.subject.fy = transform.invertY(currentEvent.y)
  }

  function dragended(currentEvent) {
    if (!currentEvent.active) simulation.alphaTarget(0)
    currentEvent.subject.fx = null
    currentEvent.subject.fy = null
  }

  function resize() {
    ;({ width, height } = canvas)
  }
  function fitToContainer(node) {
    dpi = window.devicePixelRatio || 1
    // Make it visually fill the positioned parent
    node.style.width = "100%"
    node.style.height = "100%"
    // ...then set the internal size to match
    node.width = node.offsetWidth * dpi
    node.height = node.offsetHeight * dpi
    width = node.offsetWidth * dpi
    height = node.offsetHeight * dpi
  }
</script>

<svelte:window on:resize={resize} />

<div on:resize={resize} class="container">
  {#if activeNode}
    <breadcrumb id="nodeDetails">
      <strong>{activeNode.id.split(/(?=[A-Z])/).join(" ")}</strong>
      <br />
      {#if activeNode.details}
        {#each Object.entries(activeNode.details) as detail}
          {detail[0]}:
          {detail[1]}
          <br />
        {/each}
      {/if}
    </breadcrumb>
  {/if}
  <canvas use:fitToContainer bind:this={canvas} />
</div>

<style>
  :global(body) {
    background-color: #000;
  }
  canvas {
    float: left;
  }
  .container {
    width: 100%;
    height: 90%;
    position: relative;
  }
  #nodeDetails {
    position: absolute;
    top: 1%;
    left: 1%;
    width: unset;
    color: #eee;
  }
</style>
