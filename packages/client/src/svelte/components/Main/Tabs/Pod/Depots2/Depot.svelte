<script lang="ts">
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { playerPod } from "@modules/state/base/stores"
  import type { SimulatedEntity } from "@modules/state/simulated/types"
  import { EMPTY_CONNECTION } from "@modules/utils"
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
  <div>
    {typedDepot.amount}
    {MATERIAL_TYPE[typedDepot.materialType]}
  </div>
</div>

<style lang="scss">
  .depot-item {
    border: 1px solid #fff;
    width: calc(33% - 5px);
    padding-bottom: 5px;
    margin-bottom: 10px;
    overflow: hidden;
    padding: 10px;
    font-size: 11px;
    height: 60px;
    background: rgb(74, 74, 74);

    &.connected {
      background: rgb(148, 255, 116);
      color: black;
    }

    button {
      font-size: 10px;
      padding: 5px;
      border: 1px solid white;
      margin: 1px;
    }
  }
</style>
