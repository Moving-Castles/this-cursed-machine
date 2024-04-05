<script lang="ts">
  import type { Attachment } from "@modules/state/simulated/types"
  import { onMount, tick } from "svelte"
  import { generators } from "@components/Main/Tabs/Pod/Graph/Connections/svg"
  import { MACHINE_TYPE } from "contracts/enums"
  import * as easing from "svelte/easing"
  import {
    simulatedMachines as machines,
    simulatedDepots as depots,
  } from "@modules/state/simulated/stores"
  import { draw as drawTransition } from "svelte/transition"

  export let attachment: Attachment

  const options = Object.keys(generators)
  let activeCurve = "catMullRom"

  let element: SVGElement
  const OFFSET = 40

  let [depotElement, machineElement, midzone, safezone]: [
    HTMLElement | null,
    HTMLElement | null,
    HTMLElement | null,
    HTMLElement | null,
  ] = [null, null, null]

  let [fromCoord, toCoord, throughCoord, throughCoord2] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ] // throughCoord is a random point between two

  /**
   * Calculate if a point is on an ellipse
   * Visual explanation of the parameters: https://media.geeksforgeeks.org/wp-content/uploads/a-11-300x199.png
   */
  const pointIsOnEllipse = (
    h: number,
    k: number,
    x: number,
    y: number,
    a: number,
    b: number
  ) => {
    // Find the value of angle theta
    let theta = Math.atan2(b * (y - k), a * (x - h))

    // Find the value of distance
    let distance =
      Math.pow((x - h) * Math.cos(theta) + (y - k) * Math.sin(theta), 2) /
        Math.pow(a, 2) +
      Math.pow((x - h) * Math.sin(theta) - (y - k) * Math.cos(theta), 2) /
        Math.pow(b, 2)

    if (distance < 1) {
      return true
    } else {
      return false
    }
  }

  const makeRandomPointOutsideOfEllipse = (fromCoord, toCoord) => {
    const [minX, maxX, minY, maxY] = [
      Math.min(fromCoord.x, toCoord.x),
      Math.max(fromCoord.x, toCoord.x),
      Math.min(fromCoord.y, toCoord.y),
      Math.max(fromCoord.y, toCoord.y),
    ]
    let coord = {
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
    }

    if (element) {
      const ellipse = element.parentElement?.querySelector("ellipse")
      if (ellipse) {
        const cx = Number(ellipse.getAttribute("cx"))
        const cy = Number(ellipse.getAttribute("cy"))
        const rx = Number(ellipse.getAttribute("rx"))
        const ry = Number(ellipse.getAttribute("ry"))

        // Avoid the ellipse
        while (
          pointIsOnEllipse(cx, cy, throughCoord.x, throughCoord.y, rx, ry)
        ) {
          coord = {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
          }
        }
      }
    }

    return coord
  }

  const makeRandomPointInsideSafeZone = machineType => {
    const { top, left, bottom, right } = safezone?.getBoundingClientRect()
    const [minX, maxX, minY, maxY] = [left, right, top, bottom]
    return {
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
    }
  }

  const makeRandomPointInsideMidzone = (machineType, dIndex) => {
    // Forego the midzone on these cases
    if (
      (machineType === MACHINE_TYPE.INLET && dIndex === 0) ||
      (machineType === MACHINE_TYPE.OUTLET && dIndex === 2)
    )
      return false

    const { top, left, bottom, right } = midzone?.getBoundingClientRect()
    const [minX, maxX, minY, maxY] = [left, right, top, bottom]
    return {
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
    }
  }

  const makePoints = () => {
    // Assuming depots are in order
    // The safezone on the left is used if the attachment is going to an inlet
    // The safezone on the right is used if the attachment is going to the outlet
    depotElement = document.getElementById(`depot-${attachment.depot}`)
    machineElement = document.getElementById(`machine-${attachment.machine}`)
    midzone = document.getElementById("midzone")
    safezone = document.getElementById(
      $machines[attachment.machine].machineType === MACHINE_TYPE.INLET
        ? "safezone-1"
        : "safezone-2"
    )

    const from = depotElement?.getBoundingClientRect()
    const to = machineElement?.getBoundingClientRect()

    // console.log(from, to)
    if (from && to && safezone) {
      // console.log(from, to)
      fromCoord = { x: from.right - 28, y: from.bottom - 5 }
      toCoord = {
        x: attachment.name === "I" ? to.left + 5 : to.right - 5,
        y: to.top + to.height / 2,
      }

      // unless the machine is inlet AND depot is the first
      // unless the machine is outlet and depot is the third

      const depotIndex = Object.keys($depots).indexOf(attachment.depot)

      throughCoord = makeRandomPointInsideMidzone(
        $machines[attachment.machine].machineType,
        depotIndex
      )

      throughCoord2 = makeRandomPointInsideSafeZone(
        $machines[attachment.machine].machineType
      )

      const points = throughCoord
        ? [
            fromCoord,
            { x: fromCoord.x, y: fromCoord.y + OFFSET },
            throughCoord,
            throughCoord2,
            {
              x:
                attachment.name === "I"
                  ? toCoord.x - OFFSET
                  : toCoord.x + OFFSET,
              y: toCoord.y,
            },
            toCoord,
          ]
        : [
            fromCoord,
            { x: fromCoord.x, y: fromCoord.y + OFFSET },
            throughCoord2,
            {
              x:
                attachment.name === "I"
                  ? toCoord.x - OFFSET
                  : toCoord.x + OFFSET,
              y: toCoord.y,
            },
            toCoord,
          ]
      return points
    }

    return []
  }

  const testCurve = e => {
    if (import.meta.env.DEV && e.key === "<" && e.shiftKey) {
      const index = options.indexOf(activeCurve)

      activeCurve = options[(index + 1) % options.length]

      d = generators[activeCurve](
        generatePoints(connection, CELL.WIDTH, CELL.HEIGHT)
      )
    }
  }

  const redraw = () => {
    d = generators[activeCurve](makePoints())
  }

  $: d = generators[activeCurve](makePoints())

  onMount(async () => {
    // Wait for parent to draw the safezone
    await tick()
    redraw()
  })
</script>

<svelte:window on:resize={redraw} on:keydown={testCurve} />

<g
  data-from={attachment.depot}
  data-to={attachment.machine}
  bind:this={element}
>
  <path
    in:drawTransition={{ easing: easing.expoIn, duration: 200 }}
    out:drawTransition={{ easing: easing.expoOut, duration: 150 }}
    {d}
    stroke="var(--color-success)"
    fill="none"
    stroke-width="10"
  />
</g>
