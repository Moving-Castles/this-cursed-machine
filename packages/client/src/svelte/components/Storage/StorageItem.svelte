<script lang="ts">
  import { MATERIAL_TYPE } from "../../modules/state/enums"
  import { playerPod } from "../../modules/state"
  export let storage: Store
  export let index: number

  const getConnectionName = (machineEntity: string) => {
    if ($playerPod.fixedEntities.inlets.includes(machineEntity)) return "Inlet"
    if (machineEntity === $playerPod.fixedEntities.outlet) return "Outlet"
    return "none"
  }
</script>

<div class="storage-item">
  <div><strong>#: {index + 1}</strong></div>
  <div>M: {MATERIAL_TYPE[storage.materialType]}</div>
  <div>A: {storage.amount}</div>
  <div>C: {getConnectionName(storage.storageConnection)}</div>
</div>

<style lang="scss">
  .storage-item {
    border: 1px solid #fff;
    margin-right: 20px;
    width: 30%;
    padding-bottom: 5px;
    margin-bottom: 10px;
    overflow: hidden;
    padding: 10px;
    background: #3a6f3a;
    font-size: 10px;
    height: 100px;
    width: 100px;

    button {
      font-size: 10px;
      padding: 5px;
      border: 1px solid white;
      margin: 1px;
    }
  }
</style>
