<script lang="ts">
  import type { Attachment } from "@modules/state/simulated/types"
  import * as easing from "svelte/easing"
  import { onMount, onDestroy, tick } from "svelte"
  import { generators } from "@components/Main/Tabs/Pod/Graph/Connections/svg"
  import { MACHINE_TYPE } from "contracts/enums"
  import walkable from "@modules/utils/walkable"
  import GradientPath from "@components/Main/Tabs/Pod/Graph/Connections/GradientPath.svelte"
  import {
    simulatedMachines as machines,
    simulatedDepots as depots,
  } from "@modules/state/simulated/stores"
  import { draw as drawTransition } from "svelte/transition"

  export let attachment: Attachment

  const alpha = walkable()

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

  function makePoints() {
    // Assuming depots are in order
    // The safezone on the left is used if the attachment is going to an inlet
    // The safezone on the right is used if the attachment is going to the outlet
    depotElement = document.getElementById(`depot-${attachment.depot}`)
    machineElement = document.getElementById(`machine-${attachment.machine}`)
    midzone = document.getElementById("midzone")
    safezone = document.getElementById(
      attachedMachine?.machineType === MACHINE_TYPE.INLET
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

      // throughCoord = { x: fromCoord.x, y: fromCoord.y + 40 }

      throughCoord2 = makeRandomPointInsideSafeZone(
        attachedMachine?.machineType
      )

      const points = throughCoord
        ? [
            fromCoord,
            { x: fromCoord.x, y: fromCoord.y + OFFSET },
            // throughCoord,
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

  const redraw = () => {
    points = makePoints()
    d = generators.catMullRomDynamic($alpha)(points)
  }

  $: d = generators.catMullRomDynamic($alpha)(points)
  $: attachedMachine = $machines[attachment.machine]
  $: productive = attachedMachine?.productive

  let points = makePoints()

  onMount(async () => {
    // Wait for parent to draw the safezone
    await tick()
    redraw()
  })
  onDestroy(() => {
    alpha.stop()
  })
</script>

<svelte:window on:resize={redraw} />

<g
  data-from={attachment.depot}
  data-to={attachment.machine}
  bind:this={element}
  mask="url(#mask)"
>
  <path
    in:drawTransition={{ easing: easing.expoIn, duration: 200 }}
    out:drawTransition={{ easing: easing.expoOut, duration: 150 }}
    {d}
    stroke="var(--color-success)"
    fill="none"
    stroke-width="10"
  />
  {#if productive}
    <GradientPath
      strokeWidth={10}
      {d}
      sampleCount={1}
      fromColor="#a4fa3b"
      toColor="#d7d7c3"
    />
  {/if}
</g>
