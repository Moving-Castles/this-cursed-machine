<script lang="ts">
  import { fade } from "svelte/transition"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import type { GraphMachine } from "../types"
  import { CELL, MACHINE } from "../constants"
  export let machine: GraphMachine
  import { DIRECTION } from "@components/Main/Terminal/enums"
  import { PLACEMENT_GROUP } from "../enums"
  import { GRAPH_ENTITY_STATE } from "@modules/state/simulated/enums"

  $: style = `top: ${CELL.HEIGHT * machine.y}px; left: ${CELL.WIDTH * machine.x}px;`
  $: label = `${MACHINE_TYPE[machine.machineType]} ${machine.buildIndex ?? ""}`

  function makePorts(machine: GraphMachine) {
    const verticalPosition =
      machine.placementGroup === PLACEMENT_GROUP.TOP
        ? (MACHINE.HEIGHT - 1) * CELL.HEIGHT
        : 0

    if (machine.machineType === MACHINE_TYPE.SPLITTER) {
      return [
        {
          direction: DIRECTION.INCOMING,
          style: `top: ${verticalPosition}px; left: ${CELL.WIDTH}px;`,
        },
        {
          direction: DIRECTION.OUTGOING,
          style: `top: ${verticalPosition}px; left: ${CELL.WIDTH * 4}px;`,
        },
        {
          direction: DIRECTION.OUTGOING,
          style: `top: ${verticalPosition}px; left: ${CELL.WIDTH * 6}px;`,
        },
      ]
    } else if (machine.machineType === MACHINE_TYPE.MIXER) {
      return [
        {
          direction: DIRECTION.INCOMING,
          style: `top: ${verticalPosition}px; left: 0px;`,
        },
        {
          direction: DIRECTION.INCOMING,
          style: `top: ${verticalPosition}px; left: ${CELL.WIDTH * 2}px;`,
        },
        {
          direction: DIRECTION.OUTGOING,
          style: `top: ${verticalPosition}px; left: ${CELL.WIDTH * 5}px;`,
        },
      ]
    } else {
      return [
        {
          direction: DIRECTION.INCOMING,
          style: `top: ${verticalPosition}px; left: ${CELL.WIDTH}px;`,
        },
        {
          direction: DIRECTION.OUTGOING,
          style: `top: ${verticalPosition}px; left: ${CELL.WIDTH * 5}px;`,
        },
      ]
    }
  }

  const ports = makePorts(machine)
</script>

<div
  class="machine {MACHINE_TYPE[machine.machineType]}"
  class:active={machine.state === GRAPH_ENTITY_STATE.ACTIVE}
  in:fade
  {style}
>
  <div class="inner-container">
    <div class="label">{label}</div>
    {#each ports as port}
      <div class="port {DIRECTION[port.direction]}" style={port.style} />
    {/each}
  </div>
</div>

<style lang="scss">
  .machine {
    width: calc(var(--cellWidth) * 7);
    height: calc(var(--cellWidth) * 7);
    font-size: var(--font-size-small);
    display: flex;
    justify-content: center;
    align-items: center;
    background: darkgrey;
    position: absolute;
    color: var(--background);
    background-image: url("/images/conc.jpg");
    background-size: cover;
    border: 1px solid var(--background);

    &.active {
      border: 1px solid var(--color-active);
    }

    .inner-container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .port {
        position: absolute;
        width: var(--cellWidth);
        height: var(--cellHeight);
        background: darkgrey;
        opacity: 0.5;
      }
    }
  }
</style>
