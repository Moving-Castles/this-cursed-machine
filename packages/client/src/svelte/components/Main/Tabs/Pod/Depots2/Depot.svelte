<script lang="ts">
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import type { SimulatedDepot } from "@modules/state/simulated/types"
  import { EMPTY_CONNECTION } from "@modules/utils/constants"
  export let depot: SimulatedDepot
  export let key: string
  export let index: number

  // Narrow the type
  $: typedDepot = depot as Depot

  $: connected = typedDepot.depotConnection !== EMPTY_CONNECTION
</script>

<div class="depot-item" class:connected>
  <div><strong>#: {index + 1}</strong></div>
  <div>
    {typedDepot.amount / 100}
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
      background: var(--color-active);
      color: var(--background);
    }

    button {
      font-size: 10px;
      padding: 5px;
      border: 1px solid var(--foreground);
      margin: 1px;
    }
  }
</style>
