<script lang="ts">
  import { MachineType, MaterialType } from "../../modules/state/enums"
  import { playerPod } from "../../modules/state"
  export let storage: Store
  export let key: string
  export let index: number
  import { connectStorage, disconnectStorage } from "../../modules/action"

  const connectToInlet = () => {
    connectStorage(key, MachineType.INLET)
  }

  const connectToOutlet = () => {
    connectStorage(key, MachineType.OUTLET)
  }

  const disconnectFromInlet = () => {
    disconnectStorage(MachineType.INLET)
  }

  const disconnectFromOutlet = () => {
    disconnectStorage(MachineType.OUTLET)
  }

  const getConnectionName = (machineEntity: string) => {
    if (machineEntity === $playerPod.inletEntity) return "Inlet"
    if (machineEntity === $playerPod.outletEntity) return "Outlet"
    return "none"
  }
</script>

<div class="storage-item">
  <div>#{index}</div>
  <div>M: {MaterialType[storage.materialType]}</div>
  <div>A:{storage.amount}</div>
  <div>C: {getConnectionName(storage.storageConnection)}</div>
  <div>
    <button on:click={connectToInlet}>C to in</button>
    <button on:click={connectToOutlet}>C to out</button>
    <button on:click={disconnectFromInlet}>X from in</button>
    <button on:click={disconnectFromOutlet}>X from out</button>
  </div>
</div>

<style lang="scss">
  .storage-item {
    border-bottom: 1px solid #fff;
    padding-bottom: 5px;
    margin-bottom: 10px;

    button {
      font-size: 10px;
      padding: 5px;
      border: 1px solid white;
      display: block;
    }
  }
</style>
