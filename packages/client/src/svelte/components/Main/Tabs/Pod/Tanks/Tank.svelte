<script lang="ts">
  import type { SimulatedTank } from "@modules/state/simulated/types"
  import { fade } from "svelte/transition"
  import { tweened } from "svelte/motion"
  import { materialMetadata, playerPod } from "@modules/state/base/stores"
  import { bounceOut } from "svelte/easing"
  import { selectedOption } from "@modules/ui/stores"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"
  import {
    networkIsRunning,
    shippableTanks,
    simulatedMachines,
  } from "@modules/state/simulated/stores"
  import { waitingTransaction } from "@modules/action/actionSequencer"
  import { EMPTY_CONNECTION } from "@modules/utils/constants"
  import { TANK_CAPACITY } from "@modules/state/simulated/constants"
  import { displayAmount } from "@modules/utils"

  export let tank: SimulatedTank
  export let address: string

  $: index = tank.buildIndex

  const progress = tweened(
    (displayAmount(tank.amount) / displayAmount(TANK_CAPACITY)) * 100,
    { easing: bounceOut },
  )

  const amount = tweened(displayAmount(tank.amount))

  // Narrow the type
  $: typedTank = tank as Tank

  $: if (canShip) advanceTutorial(null, $tutorialProgress, "order")

  // Tank is shippable
  $: canShip = $shippableTanks[address]

  // Tanks is shipping
  $: shipping = $waitingTransaction?.systemId === "ship" && canShip

  // Tanks is connected
  $: connected = typedTank.tankConnection !== EMPTY_CONNECTION

  // Tanks is empty
  $: empty = typedTank.amount === BigInt(0)

  // Tanks is highlighted
  $: highlight = $selectedOption?.value === address
  $: disabledHighlight = highlight && $selectedOption?.available === false

  $: $progress =
    (displayAmount(tank.amount) / displayAmount(TANK_CAPACITY)) * 100

  $: $amount = displayAmount(typedTank.amount)

  $: connectedMachine = $simulatedMachines[tank.tankConnection]

  const getConnectionName = (machineEntity: string) => {
    if (!$playerPod?.fixedEntities) return "none"
    if ($playerPod?.fixedEntities.inlets.includes(machineEntity)) return "I"
    if (machineEntity === $playerPod?.fixedEntities.outlet) return "O"
    return "none"
  }
</script>

<div
  id="tank-{address}"
  class="tank-item run-potential"
  class:shippable={canShip}
  class:highlight
  class:disabled-highlight={disabledHighlight}
  class:emphasis={index === 1 && $tutorialProgress === 7}
  class:running={$networkIsRunning && connectedMachine?.productive}
>
  <div class="tank-progress" style:height="{$progress}%"></div>
  {#if shipping}
    <div
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 100 }}
      class="overlay flash-fast"
    />
  {/if}
  <div class="id">
    <div>TANK {index}</div>
  </div>

  <div class="content">
    {#if empty}
      <div class="material-amount">
        <span class="portion-left">0</span> /
        <span class="portion-right">{displayAmount(TANK_CAPACITY)}</span>
      </div>
    {:else}
      <div class="inner-container">
        <div class="material-type">
          {$materialMetadata[typedTank.materialId]?.name}
        </div>
        <div class="material-amount">
          <span class="portion-left">
            {Math.round($amount)}
          </span>
          /
          <span class="portion-right">
            {displayAmount(TANK_CAPACITY)}
          </span>
        </div>
      </div>
    {/if}
  </div>

  <div
    class="connection"
    class:connected
    class:productive={connectedMachine?.productive}
    class:running={$networkIsRunning && connectedMachine?.productive}
  >
    {#if connected}
      {#if getConnectionName(typedTank.tankConnection) === "I"}
        ↓
      {:else if getConnectionName(typedTank.tankConnection) === "O"}
        ↑
      {/if}
    {:else}
      -
    {/if}
  </div>
</div>

<style lang="scss">
  .tank-item {
    border: 1px solid var(--foreground);
    width: calc(33% - 5px);
    overflow: hidden;
    font-size: var(--font-size-small);
    height: 70px;
    background: var(--color-grey-dark);
    display: flex;
    position: relative;
    user-select: none;

    .material-amount {
      .portion-left {
        display: inline-block;
        width: 3ch;
        text-align: right;
      }

      .portion-right {
        display: inline-block;
        width: 3ch;
      }
    }

    .overlay {
      position: absolute;
      inset: 0;
      background-color: white;
    }

    .tank-progress {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      background-color: rgba(215, 215, 195, 0.2);
      // transition: height 0.2s ease-out;
    }

    &.shippable {
      border: 1px solid var(--color-success);
    }

    .id {
      font-size: var(--font-size);
      background: var(--foreground);
      color: var(--background) !important;
      padding: 2px;
      position: absolute;
      top: 0;
      left: 0;
    }

    .content {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .inner-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .material-type {
        background: var(--foreground);
        color: var(--color-grey-dark);
        padding: 2px;
        margin-right: 1ch;
      }
    }

    .connection {
      width: 50px;
      border-left: 1px solid var(--foreground);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: var(--font-size) !important;
      color: var(--foreground);

      &.connected {
        color: var(--background);
        background: var(--foreground);

        &.productive {
          background: var(--color-success);
        }
      }
    }
  }
</style>
