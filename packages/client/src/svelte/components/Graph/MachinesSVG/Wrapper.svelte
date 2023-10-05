<script>
  import * as d3 from "d3"
  import { EntityType, MachineType } from "../../../modules/state/enums"
  import { onMount, createEventDispatcher } from "svelte"
  import {
    simulated,
    potential,
    simulatedPorts,
    simulatedConnections,
    simulatedPlayerCore,
    simulatedMachines,
  } from "../../../modules/simulator"
  import MachineInformation from "../../Machines/MachineInformation.svelte"
  import _ from "lodash"
  import { ports } from "../../../modules/state"

  const { isEqual, isEmpty } = _
  const dragBehavior = d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)

  const MACHINE_SIZE = 100
  const PORT_SIZE = 100

  let element // the parent container
  let interval // the interval used for animation
  let inspecting // the machine currenty being inspected

  // Specify the dimensions of the chart.
  let width = 0
  let height = 0

  let data = {}
  let previousData = {}
  let previousPotential = {}

  // Top level variables used in the graph
  let svg
  let simulation
  let node
  let link
  let nodes
  let links
  let rect
  let numbers
  let labels

  let inletFX = -200
  let outletFX = 200
  let inletFY = 0
  let outletFY = 0

  setData()

  $: {
    if (
      element &&
      (isEqual($potential, previousPotential) === false ||
        isEqual(data, previousData) === false ||
        isEmpty($potential))
    ) {
      updateEverything()
    }
    previousData = { ...data }
    previousPotential = { ...$potential }
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

  /**
   * Tick function updates data
   */
  const ticked = e => {
    // Used for position links
    const l = svg.selectAll("line")
    const r = svg.selectAll("rect")
    const ll = svg.selectAll("text.label")
    const n = svg.selectAll("text.number")
    const nn = svg.selectAll("g.node")

    l.attr("x1", d =>
      d.source.group === EntityType.PORT && d.target.group === EntityType.PORT
        ? d.source.x - MACHINE_SIZE / 2
        : d.source.x
    )
      .attr("y1", d =>
        d.source.group === EntityType.PORT && d.target.group === EntityType.PORT
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
    r.attr("x", d => d.x - MACHINE_SIZE / 2).attr(
      "y",
      d => d.y - MACHINE_SIZE / 2
    )
    // Labels
    ll.attr("x", d => d.x - 17).attr("y", d => d.y + 17)
    // Numbers
    n.attr("x", d => d.x + 46).attr("y", d => d.y - 36)
    // Dash or no dash
    nn.attr("stroke", d => {
      return isConnected(d) ? "#fff" : "#222"
    })
      .attr("stroke-dasharray", d => (isConnected(d) ? 20 : 0))
      .attr("stroke-opacity", d => 1)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
  }

  function round(number, increment, offset = 0) {
    return Math.ceil((number - offset) / increment) * increment + offset
  }

  /** Keep the number between min and max */
  function boundX(number, min, max) {
    min = -width / 2 + MACHINE_SIZE
    max = width / 2 - MACHINE_SIZE
    return Math.max(min, Math.min(max, number))
  }
  /** Keep the number between min and max */
  function boundY(number, min, max) {
    min = -height / 2 + MACHINE_SIZE
    max = height / 2 - MACHINE_SIZE
    return Math.max(min, Math.min(max, number))
  }

  /**
   * Events
   */
  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event, d) {
    console.log("SYATYAT")
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.x = boundX(event.x)
    d.y = boundY(event.y)
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event, d) {
    if (d.entry.potential || !d.fx) {
      d.x = boundX(event.x)
      d.y = boundY(event.y)
    } else {
      if (d.fx && d.entry.machineType === MachineType.INLET)
        [inletFX, inletFY] = [d.fx, d.fy]
      if (d.fy && d.entry.machineType === MachineType.OUTLET)
        [outletFX, outletFY] = [d.fx, d.fy]
      d.fx = boundX(event.x)
      d.fy = boundY(event.y)
    }
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0)
    if (d.entry.potential || !d.fx) return
    if (d.fx && d.entry.machineType === MachineType.INLET) inletFX = d.fx
    if (d.fy && d.entry.machineType === MachineType.OUTLET) outletFX = d.fx
    d.fx = boundX(event.x)
    d.fy = boundY(event.y)
  }

  /**
   * Set Data
   */
  function setData() {
    let inletFixed = false
    let outletFixed = false

    data = {
      nodes: [
        ...Object.entries($simulatedMachines)
          .map(([key, entry]) => ({
            id: key,
            entry,
            group: EntityType.MACHINE,
          }))
          .filter(({ entry }) => entry.entityType === EntityType.MACHINE)
          .map(d => {
            if (!inletFixed && d.entry.machineType === MachineType.INLET) {
              inletFixed = true
              return {
                ...d,
                fx: inletFX,
                fy: inletFY,
              }
            }
            if (!outletFixed && d.entry.machineType === MachineType.OUTLET) {
              outletFixed = true
              return { ...d, fx: outletFX, fy: outletFY }
            }

            return d
          }),
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
  }

  /**
   * Update
   */
  function updateEverything() {
    setData()

    // Update nodes and links with new data.
    const old = new Map(node.data().map(d => [d.id, d]))
    nodes = data.nodes.map(d => Object.assign(old.get(d.id) || {}, d))
    links = data.links.map(d => Object.assign({}, d))

    // Links
    link = svg
      .selectAll("line")
      .data(links, d => d.id)
      .join(
        enter =>
          enter
            .append("line")
            .attr("stroke", "#fff")
            .attr("stroke-dashoffset", 0)
            .attr("stroke-dasharray", 20)
            .attr("stroke-opacity", 0)
            .attr("id", d => `link-${d.id}`)
            .attr("stroke-width", d => Math.sqrt(d.value)),
        update => update, // you can make adjustments to existing elements here if needed
        exit => {
          return exit.remove()
        }
      )

    // Nodes
    node = svg
      .selectAll("g.node")
      .data(nodes, d => {
        return d.id
      })
      .join(
        enter => {
          const newNode = enter
            .filter(nn => {
              return nn
            })
            .append("g")
            .on("mouseenter", (_, d) => {
              inspecting = d.entry.machineType
            })
            .on("mouseleave", () => (inspecting = null))
            .attr("class", "node")
            .attr("id", d => `node-${d.id}`)
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
            .attr("opacity", d => (d.entry.potential ? 0.2 : 1))

          newNode
            .append("rect")
            .attr("fill", "#000")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .attr("width", d =>
              d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
            )
            .attr("height", d =>
              d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
            )
            .attr("fill", "#000")

          // Other node attributes like labels, numbers, etc., can be appended to `g` here
          newNode
            .filter(d => d.group === EntityType.MACHINE)
            .append("text")
            .attr("class", "label")
            .attr("font-size", "2rem")
            .attr("fill", "#fff")
            .attr("stroke", "none")
            .text(function (d) {
              if (d.entry.entityType === EntityType.MACHINE) {
                return `${MachineType[d.entry.machineType][0]}`
              }

              return EntityType[d.entry.entityType][0]
            })

          newNode
            .filter(d => d.group !== EntityType.PORT)
            .append("text")
            .attr("class", "number")
            .attr("text-anchor", "end")
            .attr("font-size", "0.8rem")
            .attr("fill", "#fff")
            .attr("stroke", "none")
            .text(d => $simulated[d.id]?.numericalID)

          newNode.append("title").text(d => MachineType[d.entry.machineType])

          return newNode
        },
        update => update, // adjustments to existing nodes
        exit => exit.remove()
      )

    // Restart the simulation with new data
    simulation.nodes(nodes)
    simulation.force("link").links(links)
    simulation.alpha(1).restart()

    svg
      .selectAll("g.node")
      .filter(d => {
        return !d.fx
      })
      .call(dragBehavior)
  }

  /**
   * Initialize
   */
  const init = () => {
    links = data.links.map(d => ({ ...d }))
    nodes = data.nodes.map(d => ({ ...d }))

    // Create the SVG container.
    svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;")

    // Create a simulation with several forces.
    simulation = d3
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
      .on("tick", ticked)

    // Links
    link = svg
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

    node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .on("mouseenter", (_, d) => {
        inspecting = d.entry.machineType
      })
      .on("mouseleave", () => (inspecting = null))
      .attr("class", "node")
      .attr("id", d => `node-${d.id}`)
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

    rect = node
      .append("rect")
      .attr("fill", "#000")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("width", d =>
        d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
      )
      .attr("height", d =>
        d.group === EntityType.MACHINE ? MACHINE_SIZE : PORT_SIZE
      )
      .attr("fill", d => "#000")

    labels = node
      .filter(d => d.group === EntityType.MACHINE)
      .append("text")
      .attr("class", "label")
      .attr("font-size", "2rem")
      .attr("fill", "#fff")
      .attr("stroke", "none")
      .text(function (d) {
        if (d.entry.entityType === EntityType.MACHINE) {
          return `${MachineType[d.entry.machineType][0]}`
        }

        return EntityType[d.entry.entityType][0]
      })

    // Top right numbers
    numbers = node
      .filter(d => d.group !== EntityType.PORT)
      .append("text")
      .attr("class", "number")
      .attr("text-anchor", "end")
      .attr("font-size", "0.8rem")
      .attr("fill", "#fff")
      .attr("stroke", "none")
      .text(d => $simulated[d.id]?.numericalID)

    node.append("title").text(d => MachineType[d.entry.machineType])

    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )

    // Insert SVG pls
    element.prepend(svg.node())

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

  const resizeSvg = () => {
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;")
  }

  onMount(() => {
    init()
  })
</script>

<svelte:window on:resize={resizeSvg} />

<div class="wrapper">
  {#if inspecting}
    <MachineInformation machineType={inspecting} />
  {/if}

  <div
    class="wrapper"
    bind:this={element}
    bind:clientWidth={width}
    bind:clientHeight={height}
  />
</div>

<style>
  :global(rect:hover) {
    stroke: 4px solid blue;
  }

  :global(rect),
  :global(text) {
    cursor: grab;
  }

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
