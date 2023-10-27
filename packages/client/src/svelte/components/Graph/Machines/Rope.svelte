<script>
  import { onMount } from "svelte"
  import { select } from "d3-selection"
  import { forceSimulation, forceLink } from "d3-force"
  import { drag } from "d3-drag"
  import { line } from "d3-shape"

  let svg
  const numNodes = 16

  let nodes = Array.from({ length: numNodes }, (_, i) => ({
    id: i,
    x: i === 0 || i === numNodes - 1 ? 100 + i * 25 : undefined,
    y: i === 0 || i === numNodes - 1 ? 50 + i * 25 : undefined,
    fx: i === 0 || i === numNodes - 1 ? 100 + i * 25 : null,
    fy: i === 0 || i === numNodes - 1 ? 200 : null,
  }))

  const links = Array.from({ length: numNodes - 1 }, (v, i) => ({
    source: i,
    target: i + 1,
  }))

  let simulation = forceSimulation(nodes)
    .force("link", forceLink(links).distance(20).strength(1))
    .on("tick", update)

  // This function replaces the 'tick' function in your original example
  function update() {
    svg.select("path").attr("d", line)
    nodes = nodes.slice() // force an update in Svelte's reactive system
  }

  onMount(() => {
    svg = select("#ropeSvg")
    simulation.restart()
  })

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
</script>

<div
  style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f7f7f7;"
>
  <svg id="ropeSvg" width="800" height="600" style="border: 1px solid #ddd;">
    <path fill="none" stroke="black" stroke-width="2" d={line(nodes)} />
    {#each nodes as node (node.id)}
      <circle
        cx={node.x}
        cy={node.y}
        r="5"
        fill="blue"
        on:mousedown={e => dragstarted(e, node)}
        on:mousemove={e => dragged(e, node)}
        on:mouseup={e => dragended(e, node)}
      />
    {/each}
  </svg>
</div>
