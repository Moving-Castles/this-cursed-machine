<script lang="ts">
  import { tweened } from "svelte/motion"
  import { scale } from "../../../modules/ui/transitions"
  import { simulatedMachines } from "../../../modules/simulator"
  import { graphPulse } from "../../../modules/ui/stores"
  import {
    connectionState,
    machineState,
  } from "../../../modules/state/convenience"
  import { ConnectionState, MachineType } from "../../../modules/state/enums"
  import { expoIn } from "svelte/easing"
  export let MACHINE_SIZE: number
  export let d: {
    entry: Machine
    id: string
    x: number
    y: number
    address: string
  }

  const inletOutletScale = tweened(1, { easing: expoIn })

  $: state = machineState(d.address)

  // $: {
  //   if (Math.abs($graphPulse) > 0) {
  //     console.log("s", performance.now(), d.id)
  //     $inletOutletScale = 1
  //     setTimeout(() => {
  //       $inletOutletScale = 1.2
  //     }, 200)
  //   }
  // }

  const inletOutletOrCore = dd => {
    return (
      dd.entry.machineType === MachineType.INLET ||
      dd.entry.machineType === MachineType.OUTLET ||
      dd.entry.machineType === MachineType.CORE
    )
  }
</script>

{#if d.entry.machineType !== MachineType.INLET && d.entry.machineType !== MachineType.OUTLET && d.entry.machineType !== MachineType.NONE}
  <rect
    class="node-rect {ConnectionState[state]} MACHINE_{MachineType[
      d.entry.machineType
    ]}"
    x={d.x - MACHINE_SIZE / 2}
    y={d.y - MACHINE_SIZE / 2}
    width={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
    height={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
    fill="black"
  />
  <image
    class="node-image {ConnectionState[state]} MACHINE_{MachineType[
      d.entry.machineType
    ]}"
    x={d.x - MACHINE_SIZE / 2}
    y={d.y - MACHINE_SIZE / 2}
    width={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
    height={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
    href="/images/machines/{MachineType[d.entry.machineType]}.png"
  />
  <rect
    class="node-rect {ConnectionState[state]} MACHINE_{MachineType[
      d.entry.machineType
    ]}"
    on:mouseenter
    on:mouseleave
    x={d.x - MACHINE_SIZE / 2}
    y={d.y - MACHINE_SIZE / 2}
    width={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
    height={inletOutletOrCore(d) ? MACHINE_SIZE : MACHINE_SIZE * 0.8}
    stroke={connectionState(d.entry) === ConnectionState.CONNECTED ||
    connectionState(d.entry) === ConnectionState.FLOWING
      ? "white"
      : "var(--STATE_INACTIVE)"}
    stroke-width="2"
    fill="transparent"
  />
{:else if d.entry.machineType === MachineType.INLET || MachineType.OUTLET}
  {#key $graphPulse}
    <rect
      in:scale
      on:mouseenter
      on:mouseleave
      class="{ConnectionState[state]} MACHINE_{MachineType[
        d.entry.machineType
      ]}"
      x={d.x - 20}
      y={d.y - 20}
      width={40}
      height={40}
      fill="var(--{$simulatedMachines[d.address]?.product?.materialType
        ? MaterialType[$simulatedMachines[d.address]?.product?.materialType]
        : 'STATE_INACTIVE'})"
      stroke="white"
      stroke-width="2"
    />
  {/key}
{/if}

{#if d.entry.buildIndex}
  <rect fill="white" x={d.x + 16} y={d.y + 15} width="20" height="20" />
  <text fill="black" font-size="12px" x={d.x + 18} y={d.y + 30}>
    #{d.entry.buildIndex}
  </text>
{/if}

<!-- <title>{MachineType[d.entry.machineType]}</title> -->

<style lang="scss">
  .node.CORE.FLOWING {
    animation: growAnimation 1s infinite;
  }

  .node-rect:not(.INLET):not(.OUTLET):not(.MACHINE_CORE).FLOWING,
  .node-image:not(.INLET):not(.OUTLET):not(.MACHINE_CORE).FLOWING {
    animation: rotateAnimation 0.1s infinite alternate linear;
  }

  .MACHINE_INLET.FLOWING {
    transform-origin: left; /* or transform-origin: 50% */
    transform-box: fill-box;
    animation: inletOutletAnimation 1s infinite;
  }

  .MACHINE_OUTLET.FLOWING {
    transform-origin: right; /* or transform-origin: 50% */
    transform-box: fill-box;
    animation: inletOutletAnimation 1s infinite;
  }
</style>
