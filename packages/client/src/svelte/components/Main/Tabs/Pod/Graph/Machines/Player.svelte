<script lang="ts">
  import { fade } from "svelte/transition"
  import type { GraphMachine } from "../types"
  import { CELL, PLAYER } from "../constants"
  import { DIRECTION } from "@components/Main/Terminal/enums"
  import { GRAPH_ENTITY_STATE } from "@modules/state/simulated/enums"
  import {
    inspecting,
    selectedOption,
    selectedParameters,
  } from "@modules/ui/stores"

  export let address: string
  export let machine: GraphMachine
  let selectedPortIndex = -1

  $: producing = machine?.products && machine?.products.length > 0
  $: highlight =
    $selectedParameters?.includes(address) || $selectedOption?.value === address
  $: {
    if ($selectedParameters) {
      if ($selectedParameters.includes(address)) {
        selectedPortIndex = $selectedOption?.value
      }
    }
  }

  const onMouseEnter = () => {
    if (!producing) return
    inspecting.set(machine)
  }

  const onMouseLeave = () => {
    inspecting.set(null)
  }

  $: style = `top: ${CELL.HEIGHT * machine.y}px; left: ${CELL.WIDTH * machine.x}px;`

  function makePorts() {
    return [
      {
        direction: DIRECTION.OUTGOING,
        style: `top: ${CELL.WIDTH * 4}px; left: ${CELL.WIDTH * (PLAYER.WIDTH - 1)}px;`,
      },
      {
        direction: DIRECTION.OUTGOING,
        style: `top: ${CELL.WIDTH * 8}px; left: ${CELL.WIDTH * (PLAYER.WIDTH - 1)}px;`,
      },
      {
        direction: DIRECTION.INCOMING,
        style: `top: ${CELL.WIDTH * 6}px; left: 0px;`,
      },
    ]
  }

  const ports = makePorts()
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  id="machine-{address}"
  class="player"
  class:active={machine.state === GRAPH_ENTITY_STATE.ACTIVE}
  class:highlight
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  in:fade
  {style}
>
  <div class="inner-container">
    <div class="label">YOU</div>
    {#each ports as port, i}
      <div
        class="port"
        class:highlight={selectedPortIndex === i}
        style={port.style}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .player {
    width: calc(var(--cellWidth) * 13);
    height: calc(var(--cellWidth) * 13);
    font-size: var(--font-size-small);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-image: url("/images/face5.png");
    background-size: cover;
    // border: 1px solid var(--background);
    color: var(--foreground);
    cursor: none;

    &.active {
      border: 1px solid var(--color-success);
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
        background: var(--background);
      }
    }
  }
</style>
