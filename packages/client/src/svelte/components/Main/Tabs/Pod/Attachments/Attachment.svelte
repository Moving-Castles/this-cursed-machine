<script lang="ts">
  import type { Attachment } from "@modules/state/simulated/types"
  import { onMount } from "svelte"
  import { line, curveCatmullRom } from "d3-shape"

  export let attachment: Attachment

  const OFFSET = 40

  const lineGenerator = line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curveCatmullRom.alpha(1))

  let [depotElement, machineElement]: [HTMLElement | null, HTMLElement | null] =
    [null, null]

  let [fromCoord, toCoord, throughCoord] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ] // throughCoord is a random point between two

  let path: string

  const draw = () => {
    depotElement = document.getElementById(`depot-${attachment.depot}`)
    machineElement = document.getElementById(`machine-${attachment.machine}`)

    const from = depotElement?.getBoundingClientRect()
    const to = machineElement?.getBoundingClientRect()

    // console.log(from, to)
    if (from && to) {
      // console.log(from, to)
      fromCoord = { x: from.right - 28, y: from.bottom }
      toCoord = {
        x: attachment.name === "I" ? to.left : to.right,
        y: to.top + to.height / 2,
      }

      const [minX, maxX, minY, maxY] = [
        Math.min(fromCoord.x, toCoord.x),
        Math.max(fromCoord.x, toCoord.x),
        Math.min(fromCoord.y, toCoord.y),
        Math.max(fromCoord.y, toCoord.y),
      ]

      throughCoord = {
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY,
      }

      const points = [
        fromCoord,
        { x: fromCoord.x, y: fromCoord.y + OFFSET },
        throughCoord,
        {
          x: attachment.name === "I" ? toCoord.x - OFFSET : toCoord.x + OFFSET,
          y: toCoord.y,
        },
        toCoord,
      ]

      path = lineGenerator(points)
    }
  }

  onMount(draw)
</script>

<svelte:window on:resize={draw} />

<path d={path} stroke="var(--color-success)" fill="none" stroke-width="10" />
