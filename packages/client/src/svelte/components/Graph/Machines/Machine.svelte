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

  // const inletOutletScale = tweened(1, { easing: expoIn })

  $: state = machineState(d.address)

  const inletOutletOrCore = dd => {
    return (
      dd.entry.machineType === MachineType.INLET ||
      dd.entry.machineType === MachineType.OUTLET ||
      dd.entry.machineType === MachineType.CORE
    )
  }
</script>

{#if d.entry.machineType !== MachineType.INLET && d.entry.machineType !== MachineType.OUTLET && d.entry.machineType !== MachineType.NONE}
  {#key $graphPulse}
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
  {/key}
{:else if d.entry.machineType === MachineType.INLET || MachineType.OUTLET}
  {#key $graphPulse}
    <rect
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
  * {
    transform-box: fill-box;
  }

  .node-rect:not(.INLET):not(.OUTLET):not(.MACHINE_CORE).FLOWING,
  .node-image:not(.INLET):not(.OUTLET):not(.MACHINE_CORE).FLOWING {
    animation: rotateAnimation 0.1s infinite alternate linear;
  }

  .MACHINE_INLET.FLOWING {
    transform-origin: left; /* or transform-origin: 50% */
    transform-box: fill-box;
    animation: pushAnimation 500ms cubic-bezier(0.95, 0.05, 0.795, 0.035),
      pullAnimation 500ms linear 500ms;
  }

  .MACHINE_OUTLET {
    transition: transform 0.2s ease;
  }
  .MACHINE_OUTLET.FLOWING {
    transform-origin: right; /* or transform-origin: 50% */
    transform-box: fill-box;
    transform: scale(1.2, 1);
    animation: pullAnimation 500ms cubic-bezier(0.95, 0.05, 0.795, 0.035),
      pushAnimation 500ms linear 500ms;
  }

  .MACHINE_CORE.FLOWING {
    animation: growAnimation 500ms cubic-bezier(0.95, 0.05, 0.795, 0.035),
      shrinkAnimation 500ms linear 500ms;
  }

  .FLOWING:not(.MACHINE_CORE):not(.MACHINE_INLET):not(.MACHINE_OUTLET) {
    animation: rotateAnimation 500ms linear;
  }

  @keyframes pushAnimation {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2, 1);
    }
  }
  @keyframes pullAnimation {
    0% {
      transform: scale(1.2, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  @keyframes growAnimation {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }

  @keyframes shrinkAnimation {
    0% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes rotateAnimation {
    0% {
      transform: rotate(-12deg);
    }
    100% {
      transform: rotate(12deg);
    }
  }

  @keyframes rotateAnimation {
    0% {
      transform: rotate(-12deg);
    }
    100% {
      transform: rotate(12deg);
    }
  }
</style>
