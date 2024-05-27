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
  import { networkIsRunning } from "@modules/state/simulated/stores"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import { idToAddress } from "@svelte/modules/utils"
  import { player } from "@modules/state/base/stores"

  export let address: string
  export let machine: GraphMachine
  let selectedPortIndex = -1

  $: producing = machine?.products && machine?.products.length > 0
  $: highlight = $selectedOption?.value === address
  $: disabledHighlight = highlight && $selectedOption?.available === false
  $: {
    if ($selectedParameters) {
      if ($selectedParameters.includes(address)) {
        selectedPortIndex = $selectedOption?.value
      }
    }
  }

  const TOP_PLAYERS = [
    "0x6b529A35b9CfFceD12138f8468190b581840bF09".toLowerCase(),
    "0xacd5f5d5cbcb52bdf424a87d9c66ce4b29d62f63".toLowerCase(),
    "0xa68db2947f2e155f3df2065235ab7007b1542eea".toLowerCase(),
    "0xa7c720266a3d834635cfc86f5249ee73164efb9c".toLowerCase(),
    "0x7f4e21b39d6506e333b9b470b3fdedd4fcbbc6e8".toLowerCase(),
    "0x19e900f9ee644b19c566cf4351d15e763768140e".toLowerCase(),
    "0x41a2504348072d4d706b15770b9a3fd0dd6f570a".toLowerCase(),
    "0xd0f46a5d48596409264d4efc1f3b229878fff743".toLowerCase(),
    "0x4d300a9b48bcef03daf16618bdadb5028ac15f8f".toLowerCase(),
    "0x9b52a3453b95b1d22e068e87853fb6be46e23eb7".toLowerCase(),
    "0xe185889d284a987773fdc1db2566a68719398599".toLowerCase(),
  ]
  const isTopPlayer = TOP_PLAYERS.includes(idToAddress(address))

  const onMouseEnter = () => {
    if (!producing) return
    inspecting.set(machine)
  }

  const onMouseLeave = () => {
    inspecting.set(null)
  }

  $: style = `background-image: url(/images/machines/${MACHINE_TYPE[machine.machineType]}.png); top: ${CELL.HEIGHT * machine.y}px; left: ${CELL.WIDTH * machine.x}px;`

  function makePorts() {
    return [
      {
        direction: DIRECTION.OUTGOING,
        style: `top: ${CELL.HEIGHT * 4}px; left: ${CELL.WIDTH * (PLAYER.WIDTH - 1)}px;`,
      },
      {
        direction: DIRECTION.OUTGOING,
        style: `top: ${CELL.HEIGHT * 8}px; left: ${CELL.WIDTH * (PLAYER.WIDTH - 1)}px;`,
      },
      {
        direction: DIRECTION.INCOMING,
        style: `top: ${CELL.HEIGHT * 6}px; left: 0px;`,
      },
    ]
  }

  const ports = makePorts()
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  id="machine-{address}"
  class="player run-potential {$networkIsRunning && producing
    ? `running-${Math.floor(Math.random() * 3) + 1}`
    : ''}"
  class:active={machine.state === GRAPH_ENTITY_STATE.ACTIVE}
  class:highlight
  class:disabled-highlight={disabledHighlight}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  in:fade
  {style}
>
  <div class="inner-container">
    {#if isTopPlayer}
      <div class="hat">
        <img src="/images/hat-small.png" alt="hat" />
      </div>
    {/if}
    <div class="label">{$player.name}</div>
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
    --playerWidth: 12;
    --playerHeight: 12;
    width: calc(var(--cellWidth) * var(--playerWidth));
    height: calc(var(--cellWidth) * var(--playerHeight));
    font-size: var(--font-size-label);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
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

      .hat {
        position: absolute;
        top: -45px;
        left: -6px;
        width: 130px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .label {
        position: absolute;
        left: 0;
        background: var(--foreground);
        color: var(--background);
        white-space: nowrap;
        letter-spacing: -1px;
        padding: 2px;
        top: 0;
        transform: translateX(-20px) translateY(-5px);
      }

      .port {
        position: absolute;
        width: var(--cellWidth);
        height: var(--cellHeight);
        background: var(--background);
      }
    }
  }
</style>
