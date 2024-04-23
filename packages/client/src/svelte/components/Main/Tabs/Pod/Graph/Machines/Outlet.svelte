<script lang="ts">
  import { fade } from "svelte/transition"
  import type { GraphMachine } from "../types"
  import { CELL } from "../constants"
  import { DIRECTION } from "@components/Main/Terminal/enums"
  import { GRAPH_ENTITY_STATE } from "@modules/state/simulated/enums"
  import { selectedOption } from "@modules/ui/stores"
  import { networkIsRunning } from "@modules/state/simulated/stores"

  export let address: string
  export let machine: GraphMachine

  $: style = `top: ${CELL.HEIGHT * machine.y}px; left: ${CELL.WIDTH * machine.x}px;`
  $: label = "→"
  $: outerLabel = `OUTLET ${machine.buildIndex ?? ""}`
  $: highlight = $selectedOption?.value === address
  $: disabledHighlight = highlight && !$selectedOption?.available

  function makePorts() {
    return [
      {
        direction: DIRECTION.INCOMING,
        style: `top: ${CELL.WIDTH * 2}px; left: 0px;`,
      },
    ]
  }

  const ports = makePorts()
</script>

<div
  in:fade
  id="machine-{address}"
  class="outlet run-potential {$networkIsRunning && machine.productive
    ? `running-${Math.floor(Math.random() * 3) + 1}`
    : ''}"
  class:active={machine.state === GRAPH_ENTITY_STATE.ACTIVE}
  class:highlight
  class:disabled-highlight={disabledHighlight}
  class:productive={machine.productive}
  {style}
>
  <div class="inner-container">
    <div class="outer-label">
      {outerLabel}
    </div>

    <div class="label">{label}</div>
    {#each ports as port}
      <div
        class:productive={machine.productive}
        class="port"
        style={port.style}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .outlet {
    width: calc(var(--cellWidth) * 5);
    height: calc(var(--cellWidth) * 5);
    font-size: var(--font-size);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: var(--background);
    color: var(--foreground);

    &.connected {
      background: var(--color-success);
      color: var(--background);
    }

    &.active {
      border: 1px solid var(--color-success);
    }

    &.productive {
      background: var(--color-success);
      color: var(--black);
    }

    .inner-container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .outer-label {
        position: absolute;
        left: 0;
        background: var(--foreground);
        color: var(--background);
        white-space: nowrap;
        letter-spacing: -1px;
        padding: 2px;
        font-size: var(--font-size-small);
        top: 0;
        transform: translateX(-10px) translateY(-5px);
      }

      .port {
        position: absolute;
        width: var(--cellWidth);
        height: var(--cellHeight);
        background: var(--foreground);

        &.productive {
          background: var(--black);
        }
      }
    }
  }
</style>
