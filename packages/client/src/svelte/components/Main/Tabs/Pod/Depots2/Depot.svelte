<script lang="ts">
  import type { SimulatedDepot } from "@modules/state/simulated/types"
  import { playerPod, machines } from "@modules/state/base/stores"
  import { shippableDepots } from "@modules/state/simulated/stores"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { EMPTY_CONNECTION } from "@modules/utils/constants"
  export let depot: SimulatedDepot
  export let key: string
  export let index: number

  // $: console.log($shippableDepots)

  $: canShip = $shippableDepots[key]
  $: if (canShip) advanceTutorial(null, $tutorialProgress, "order")

  // Narrow the type
  $: typedDepot = depot as Depot

  $: connected = typedDepot.depotConnection !== EMPTY_CONNECTION
  $: empty = typedDepot.amount === 0

  const getConnectionName = (machineEntity: string) => {
    if ($playerPod.fixedEntities.inlets.includes(machineEntity)) return "I"
    if (machineEntity === $playerPod.fixedEntities.outlet) return "O"
    return "none"
  }
</script>

<div class="depot-item" class:shippable={canShip}>
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
          {Math.round(typedDepot.amount / 100)}/100
        </div>
      </div>
    {/if}
  </div>

  <div class="connection" class:connected>
    {#if connected}
      {`${getConnectionName(typedDepot.depotConnection)}${$machines[typedDepot.depotConnection]?.buildIndex ?? ""}`}
    {/if}
  </div>
</div>

<style lang="scss">
  .depot-item {
    border: 1px solid #fff;
    width: calc(33% - 5px);
    overflow: hidden;
    font-size: var(--font-size-small);
    height: 70px;
    background: rgb(74, 74, 74);
    display: flex;

    &.shippable {
      border: 1px solid var(--color-active);
    }

    .id {
      width: 50px;
      border-right: 1px solid var(--foreground);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: var(--font-size-normal);
      background: var(--foreground);
      color: var(--background);
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
        color: rgb(74, 74, 74);
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

      &.connected {
        background: var(--color-active);
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
