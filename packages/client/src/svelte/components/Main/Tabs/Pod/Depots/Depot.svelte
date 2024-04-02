<script lang="ts">
  import type { SimulatedDepot } from "@modules/state/simulated/types"
  import { playerPod, machines } from "@modules/state/base/stores"
  import { shippableDepots } from "@modules/state/simulated/stores"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { EMPTY_CONNECTION } from "@modules/utils/constants"

  export let depot: SimulatedDepot
  export let address: string
  export let index: number

  $: canShip = $shippableDepots[address]
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

<div id="depot-{address}" class="depot-item" class:shippable={canShip}>
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
    padding: 10px;
    font-size: 6px;
    height: 80px;
    width: 260px;
    background: var(--color-grey-dark);

    &.connected {
      background: var(--color-alert);
    }

    button {
      font-size: var(--font-size-small);
      padding: 5px;
      border: 1px solid var(--foreground);
      margin: 1px;
    }
  }
</style>
