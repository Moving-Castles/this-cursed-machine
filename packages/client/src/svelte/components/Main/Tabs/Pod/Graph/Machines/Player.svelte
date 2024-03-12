<script lang="ts">
  import { fade } from "svelte/transition"
  import type { GraphMachine } from "../types"
  import { CELL, PLAYER } from "../constants"
  import { DIRECTION } from "@components/Main/Terminal/enums"
  export let machine: GraphMachine

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

<div class="player" in:fade {style}>
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
    font-size: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-image: url("/images/eye.png");
    background-size: cover;
    border: 1px solid black;

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
        background: black;
      }
    }
  }
</style>
