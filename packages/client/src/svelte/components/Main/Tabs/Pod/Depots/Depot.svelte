<script lang="ts">
  import type { SimulatedDepot } from "@modules/state/simulated/types"
  import { fade } from "svelte/transition"
  import { tweened } from "svelte/motion"
  import { playerPod } from "@modules/state/base/stores"
  import { bounceOut } from "svelte/easing"
  import { selectedOption } from "@modules/ui/stores"
  import { shippableDepots } from "@modules/state/simulated/stores"
  import { waitingTransaction } from "@modules/action/actionSequencer"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"
  import { MACHINE_TYPE, MATERIAL_TYPE } from "@modules/state/base/enums"
  import { EMPTY_CONNECTION } from "@modules/utils/constants"
  import { DEPOT_CAPACITY } from "@modules/state/simulated/constants"
  import { UI_SCALE_FACTOR } from "@modules/ui/constants"

  export let depot: SimulatedDepot
  export let address: string
  export let index: number

  const progress = tweened(
    (Math.round(depot.amount / UI_SCALE_FACTOR) /
      (DEPOT_CAPACITY / UI_SCALE_FACTOR)) *
      100,
    { easing: bounceOut }
  )
  const amount = tweened(Math.round(depot.amount / UI_SCALE_FACTOR))

  $: canShip = $shippableDepots[address]
  $: if (canShip) advanceTutorial(null, $tutorialProgress, "order")
  $: shipping = $waitingTransaction?.systemId === "ship" && canShip
  // Narrow the type
  $: typedDepot = depot as Depot
  $: connected = typedDepot.depotConnection !== EMPTY_CONNECTION
  $: empty = typedDepot.amount === 0
  $: highlight = $selectedOption?.value === address
  $: $progress =
    (Math.round(typedDepot.amount / UI_SCALE_FACTOR) /
      (DEPOT_CAPACITY / UI_SCALE_FACTOR)) *
    100
  $: $amount = typedDepot.amount / UI_SCALE_FACTOR

  const getConnectionName = (machineEntity: string) => {
    if (!$playerPod?.fixedEntities) return "none"
    if ($playerPod?.fixedEntities.inlets.includes(machineEntity)) return "I"
    if (machineEntity === $playerPod?.fixedEntities.outlet) return "O"
    return "none"
  }
</script>

<div
  id="depot-{address}"
  class="depot-item"
  class:shippable={canShip}
  class:highlight
>
  <div class="depot-progress" style:height="{$progress}%"></div>
  {#if shipping}
    <div
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 100 }}
      class="overlay flash-fast"
    />
  {/if}
  <div class="id">
    <div>{index + 1}</div>
  </div>

  <div class="content">
    {#if empty}
      <div>EMPTY</div>
    {:else}
      <div class="inner-container">
        <div class="material-type">
          {MATERIAL_TYPE[typedDepot.materialType]}
        </div>
        <div class="material-amount">
          {Math.round($amount)} / {DEPOT_CAPACITY / UI_SCALE_FACTOR}
        </div>
      </div>
    {/if}
  </div>

  <div class="connection" class:connected>
    {#if connected}
      {#if getConnectionName(typedDepot.depotConnection) === "I"}
        ↓
      {:else if getConnectionName(typedDepot.depotConnection) === "O"}
        ↑
      {/if}
    {:else}
      -
    {/if}
  </div>
</div>

<style lang="scss">
  .depot-item {
    border: 1px solid var(--foreground);
    width: calc(33% - 5px);
    overflow: hidden;
    font-size: var(--font-size-small);
    height: 70px;
    background: var(--color-grey-dark);
    display: flex;
    position: relative;

    .overlay {
      position: absolute;
      inset: 0;
      background-color: white;
    }

    .depot-progress {
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
      color: var(--background);
      padding: 5px;
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

      // &:not(.connected) {
      //   &::after {
      //     content: "";
      //     position: absolute;
      //     width: 40px;
      //     height: 1px;
      //     background: white;
      //     transform: rotate(45deg);
      //   }
      // }

      &.connected {
        background: var(--color-success);
        color: var(--background);
      }
    }

    button {
      font-size: var(--font-size-small);
      padding: 5px;
      border: 1px solid var(--foreground);
      margin: 1px;
    }
  }
</style>
