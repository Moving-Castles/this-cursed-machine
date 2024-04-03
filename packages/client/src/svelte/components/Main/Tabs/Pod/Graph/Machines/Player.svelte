<script lang="ts">
  import { fade } from "svelte/transition"
  import type { GraphMachine } from "../types"
  import { CELL, PLAYER } from "../constants"
  import { DIRECTION } from "@components/Main/Terminal/enums"
  import { GRAPH_ENTITY_STATE } from "@modules/state/simulated/enums"
  import { inspecting } from "@modules/ui/stores"

  export let address: string
  export let machine: GraphMachine

  $: producing = machine?.products && machine?.products.length > 0

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
        direction: DIRECTION.INCOMING,
        style: `top: ${CELL.WIDTH * 6}px; left: 0px;`,
      },
      {
        direction: DIRECTION.OUTGOING,
        style: `top: ${CELL.WIDTH * 4}px; left: ${CELL.WIDTH * (PLAYER.WIDTH - 1)}px;`,
      },
      {
        direction: DIRECTION.OUTGOING,
        style: `top: ${CELL.WIDTH * 8}px; left: ${CELL.WIDTH * (PLAYER.WIDTH - 1)}px;`,
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
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  in:fade
  {style}
>
  <div class="inner-container">
    <div class="label">YOU</div>
    {#each ports as port}
      <div class="port" style={port.style} />
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
    // background-image: url("/images/eye3.gif");
    background-image: url("/images/face.jpg");
    background-image: url("/images/face5.png");

    // background-image: url("/images/eye2.gif");
    background-size: cover;
    border: 1px solid var(--background);
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
