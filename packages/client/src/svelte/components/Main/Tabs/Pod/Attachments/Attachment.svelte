<script lang="ts">
  import type { Attachment } from "@modules/state/simulated/types"
  import * as easing from "svelte/easing"
  import { onMount, onDestroy, tick } from "svelte"
  import { generators } from "@components/Main/Tabs/Pod/Graph/Connections/svg"
  import { MACHINE_TYPE } from "contracts/enums"
  import walkable from "@modules/utils/walkable"
  import { networkIsRunning } from "@modules/state/simulated/stores"
  import { playSound } from "@modules/sound"
  import { materialMetadata } from "@modules/state/base/stores"
  import {
    simulatedMachines as machines,
    simulatedTanks as tanks,
  } from "@modules/state/simulated/stores"
  import { draw as drawTransition } from "svelte/transition"

  export let attachment: Attachment

  $: d = generators.catMullRomDynamic($alpha)(points)
  $: attachedMachine = $machines[attachment.machine]
  $: productive = attachedMachine?.productive
  $: carrying = attachedMachine?.products
    ? attachedMachine.products.length > 0
    : false
  $: materialColor = carrying
    ? $materialMetadata[attachedMachine.products[0].materialId]?.color?.hex
    : "inherit"
  $: console.log(materialColor, attachedMachine)

  const alpha = walkable()
  const OFFSET = 40

  let element: SVGElement

  let [tankElement, machineElement, midzone, safezone]: [
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

  const playPlugSound = () => {
    playSound("tcm", "plugTank")
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

  function makePoints() {
    // Assuming tanks are in order
    // The safezone on the left is used if the attachment is going to an inlet
    // The safezone on the right is used if the attachment is going to the outlet
    tankElement = document.getElementById(`tank-${attachment.tank}`)
    machineElement = document.getElementById(`machine-${attachment.machine}`)
    midzone = document.getElementById("midzone")
    safezone = document.getElementById(
      attachedMachine?.machineType === MACHINE_TYPE.INLET
        ? "safezone-1"
        : "safezone-2"
    )

    const from = tankElement?.getBoundingClientRect()
    const to = machineElement?.getBoundingClientRect()

    if (from && to && safezone) {
      fromCoord = { x: from.right - 28, y: from.bottom - 5 }
      toCoord = {
        x: attachment.name === "I" ? to.left + 5 : to.right - 5,
        y: to.top + to.height / 2,
      }

      // unless the machine is inlet AND tank is the first
      // unless the machine is outlet and tank is the third

      const tankIndex = Object.keys($tanks).indexOf(attachment.tank)

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
  data-from={attachment.tank}
  data-to={attachment.machine}
  bind:this={element}
  mask="url(#mask)"
  class="run-potential {$networkIsRunning && productive
    ? `running-${Math.floor(Math.random() * 3) + 1}`
    : ''}"
>
  <path
    on:introstart={playPlugSound}
    in:drawTransition={{ easing: easing.expoIn, duration: 200 }}
    out:drawTransition={{ easing: easing.expoOut, duration: 150 }}
    {d}
    stroke={productive ? materialColor : "var(--white)"}
    fill="none"
    stroke-width="10"
  />
</g>
