<script lang="ts">
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { playerPod, depots, machines } from "@modules/state/base/stores"
  import { blocksSinceLastResolution } from "@modules/state/resolver/stores"
  import type { SimulatedEntity } from "@modules/state/simulated/types"
  import { blockNumber } from "@modules/network"
  import { patches } from "@modules/state/resolver/patches/stores"
  import { EMPTY_CONNECTION } from "@modules/utils/constants"
  export let depot: SimulatedEntity
  export let key: string
  export let index: number

  // Narrow the type
  $: typedDepot = depot as Depot

  $: connected = typedDepot.depotConnection !== EMPTY_CONNECTION

  const getConnectionName = (machineEntity: string) => {
    if ($playerPod.fixedEntities.inlets.includes(machineEntity)) return "Inlet"
    if (machineEntity === $playerPod.fixedEntities.outlet) return "Outlet"
    return "none"
  }
</script>

<div class="depot-item" class:connected>
  <div><strong>#: {index + 1}</strong></div>
  <div>lastRes.: {$playerPod.lastResolved}</div>
  <div>curr. block.: {$blockNumber}</div>
  <div>blocks since res.: {$blocksSinceLastResolution}</div>
  <hr />
  <div>
    sim.depot: {typedDepot.amount}
    {MATERIAL_TYPE[typedDepot.materialType]}
  </div>
  <div>
    chain depot: {$depots[key].amount}
    {MATERIAL_TYPE[$depots[key].materialType]}
  </div>
  <hr />
  <div>
    conn.: {`${getConnectionName(typedDepot.depotConnection)} #${$machines[typedDepot.depotConnection]?.buildIndex ?? ""}`}
  </div>
  <hr />
  {#if $patches[key] && $patches[key].inputs}
    <div>
      IN-patch: {MATERIAL_TYPE[$patches[key].inputs[0]?.materialType]}
      {$patches[key].inputs[0]?.amount}
    </div>
  {/if}
  {#if $patches[key] && $patches[key].outputs}
    <div>
      OUT-patch: {MATERIAL_TYPE[$patches[key].outputs[0]?.materialType]}
      {$patches[key].outputs[0]?.amount}
    </div>
  {/if}
</div>

<style lang="scss">
  .depot-item {
    border: 1px solid #fff;
    margin-right: 20px;
    width: 30%;
    padding-bottom: 5px;
    margin-bottom: 10px;
    overflow: hidden;
    padding: 10px;
    font-size: 11px;
    height: 160px;
    width: 260px;
    background: rgb(74, 74, 74);

    &.connected {
      background: orangered;
    }

    button {
      font-size: 10px;
      padding: 5px;
      border: 1px solid white;
      margin: 1px;
    }
  }
</style>
