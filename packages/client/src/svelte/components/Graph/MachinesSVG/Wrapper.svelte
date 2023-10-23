<script>
  import * as d3 from "d3"
  import {
    EntityType,
    MachineType,
    MaterialType,
  } from "../../../modules/state/enums"
  import { connectionSourceMachine } from "../../../modules/state/convenience"
  import { onMount, createEventDispatcher } from "svelte"
  import {
    simulated,
    simulatedPorts,
    simulatedConnections,
    simulatedPlayerCore,
    simulatedMachines,
  } from "../../../modules/simulator"
  import MachineInformation from "../../Machines/MachineInformation.svelte"
  import _ from "lodash"
  import { ports } from "../../../modules/state"

  let done = false

  const { isEqual, isEmpty } = _

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

  $: {
    if (element && isEqual(data, previousData) === false) {
      updateEverything()
    }
    previousData = { ...data }
  }

  const onClick = () => {
    // console.log("on click")
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

    // function x1 (d) {
    //   const linksWithSource = data.links.filter(l => l.source === d.source.id)

    //   let OFFSET = 0

    //   if (linksWithSource.length > 1) {
    //     OFFSET = linksWithSource.map(l => l.id).indexOf(d.id)
    //     OFFSET = OFFSET * 20 - (linksWithSource.length * 10) / 2
    //   }

    //   return d.source.group === EntityType.PORT &&
    //     d.target.group === EntityType.PORT
    //     ? d.source.x - MACHINE_SIZE / 2 + OFFSET
    //     : d.source.x + OFFSET
    // }
    // Create the line
    l.attr("x1", d => {
      const linksWithSource = data.links.filter(l => l.source === d.source.id)

      let OFFSET = 0

      if (linksWithSource.length > 1) {
        OFFSET = linksWithSource.map(l => l.id).indexOf(d.id)
        OFFSET = OFFSET * 20 - (linksWithSource.length * 10) / 2
      }

      return d.source.group === EntityType.PORT &&
        d.target.group === EntityType.PORT
        ? d.source.x - MACHINE_SIZE / 2 + OFFSET
        : d.source.x + OFFSET
    })
      .attr("y1", d => {
        const linksWithSource = data.links.filter(l => l.source === d.source.id)

        let OFFSET = 0

        if (linksWithSource.length > 1) {
          OFFSET = linksWithSource.map(l => l.id).indexOf(d.id)
          OFFSET = OFFSET * 20 - (linksWithSource.length * 10) / 2
        }

        return d.source.group === EntityType.PORT &&
          d.target.group === EntityType.PORT
          ? d.source.y - (MACHINE_SIZE - PORT_SIZE) / 2 + OFFSET
          : d.source.y + OFFSET
      })
      .attr("x2", d => {
        const linksWithTarget = data.links.filter(l => l.target === d.target.id)

        let OFFSET = 0

        if (linksWithTarget.length > 1) {
          OFFSET = linksWithTarget.map(l => l.id).indexOf(d.id)
          OFFSET = OFFSET * 20 - (linksWithTarget.length * 10) / 2
        }

        return d.target.group === EntityType.MACHINE
          ? d.target.x - (MACHINE_SIZE - PORT_SIZE) / 2 + OFFSET
          : d.target.x - (MACHINE_SIZE - PORT_SIZE) / 2 + OFFSET
      })
      .attr("y2", d => {
        const linksWithTarget = data.links.filter(l => l.target === d.target.id)

        let OFFSET = 0

        if (linksWithTarget.length > 1) {
          OFFSET = linksWithTarget.map(l => l.id).indexOf(d.id)
          OFFSET = OFFSET * 20 - (linksWithTarget.length * 10) / 2
        }

        return d.target.group === EntityType.MACHINE
          ? d.target.y - (MACHINE_SIZE - PORT_SIZE) / 2 + OFFSET
          : d.target.y - (MACHINE_SIZE - PORT_SIZE) / 2 + OFFSET
      })
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
    n.attr("x", d => d.x + 46).attr("y", d => d.y - 32)
    // Dash or no dash
    nn.attr("stroke", d => {
      return isConnected(d) || d.entry?.machineType === MachineType.INLET
        ? "#fff"
        : "#222"
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
   * Set Data
   */
  function setData() {
    let inletFixed = false
    let outletFixed = false
    inletFX = -width / 2 + MACHINE_SIZE / 2
    outletFX = width / 2 - MACHINE_SIZE / 2 - 8

    data = {
      nodes: [
        ...Object.entries($simulatedMachines)
          .map(([key, entry]) => ({
            id: key,
            entry,
            group: EntityType.MACHINE,
          }))
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
        ...Object.entries($simulatedConnections)
          .map(([key, entry]) => ({
            id: key,
            entry,
          }))
          .map(({ id, entry }) => {
            // Connect the source machine to the target machine
            const sP = $simulatedPorts[entry.sourcePort]
            const tP = $simulatedPorts[entry.targetPort]

            if (sP && tP) {
              return {
                id,
                entry,
                group: EntityType.CONNECTION,
                source: sP.carriedBy,
                target: tP.carriedBy,
              }
            }
            return false
          })
          .filter(thing => thing), // check if they are all valid links
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
            .attr("stroke-width", 20),
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
              inspecting = { address: d.id, machineType: d.entry.machineType }
            })
            .on("mouseleave", () => (inspecting = null))
            .attr("class", "node")
            .attr("stroke", d => (d.entry.potential ? "#222" : "#fff"))
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
            .attr("stroke", d => (d.entry.potential ? "#222" : "#fff"))
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
      .attr("stroke", d => {
        return d.entry?.product?.materialType
          ? `var(--${MaterialType[d.entry.product.materialType]})`
          : "#fff"
      })
      .attr("stroke-dashoffset", 0)
      .attr("stroke-dasharray", 20)
      .attr("stroke-opacity", 0)
      .attr("id", d => `link-${d.id}`)
      .attr("stroke-width", 20)

    node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .on("mouseenter", (_, d) => {
        inspecting = { address: d.id, machineType: d.entry.machineType }
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
      .attr("stroke", d => (d.entry.potential ? "#222" : "#fff"))
      .attr("stroke-opacity", d =>
        d.entry?.machineType === MachineType.INLET ||
        d.entry?.machineType === MachineType.OUTLET
          ? 0
          : 1
      )
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
      .attr("fill", d => (d.entry.potential ? "#222" : "#fff"))
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
      .filter(d => $simulated[d.id]?.buildIndex)
      .append("text")
      .attr("class", "number")
      .attr("text-anchor", "end")
      .attr("font-size", "0.8rem")
      .attr("fill", d => (d.entry.potential ? "#222" : "#fff"))
      .attr("stroke", "none")
      .text(d => `#${$simulated[d.id]?.buildIndex}`)

    node.append("title").text(d => MachineType[d.entry.machineType])

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
    setData()
    init()
  })
</script>

<svelte:window on:resize={resizeSvg} />

<div on:click={onClick} class="wrapper">
  <!-- <div class="strobe flash-fast" class:hidden={done} /> -->
  {#if inspecting}
    <MachineInformation
      address={inspecting.address}
      machineType={inspecting.machineType}
    />
  {/if}

  <div
    class="wrapper"
    bind:this={element}
    bind:clientWidth={width}
    bind:clientHeight={height}
  />
</div>

<style lang="scss">
  :global(rect:hover) {
    stroke: 4px solid blue;
  }

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .strobe {
      position: absolute;
      width: 100%;
      height: 100%;
      inset: 0;
      z-index: 50;
      background: white;
      // background: radial-gradient(
      //   ellipse at center,
      //   rgba(255, 255, 255, 1) 0%,
      //   rgba(255, 255, 255, 1) 80%,
      //   rgba(255, 255, 255, 0) 85%,
      //   rgba(255, 255, 255, 0) 100%
      // );

      &.hidden {
        display: none;
      }
    }
  }
</style>
