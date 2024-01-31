<script lang="ts">
  import { MachineType, MaterialType } from "../../modules/state/enums"
  import { playerPod } from "../../modules/state"
  export let storage: Store
  export let key: string
  export let index: number
  import {
    clearStorage,
    connectStorage,
    disconnectStorage,
    shipStorage,
  } from "../../modules/action"

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

  const clear = () => {
    clearStorage(key)
  }

  const ship = () => {
    shipStorage(key)
  }

  const getConnectionName = (machineEntity: string) => {
    if (machineEntity === $playerPod.fixedEntities?.inletEntity) return "Inlet"
    if (machineEntity === $playerPod.fixedEntities?.outletEntity) return "Outlet"
    return "none"
  }
</script>

<div class="storage-item">
  <div><strong>#: {index + 1}</strong></div>
  <div>M: {MaterialType[storage.materialType]}</div>
  <div>A: {storage.amount}</div>
  <div>C: {getConnectionName(storage.storageConnection)}</div>
  <!-- <div>
    <button on:click={connectToInlet}>C to in</button>
    <button on:click={connectToOutlet}>C to out</button>
    <button on:click={disconnectFromInlet}>X from in</button>
    <button on:click={disconnectFromOutlet}>X from out</button>
    <button on:click={ship}>Ship</button>
    <button on:click={clear}>Clear</button>
  </div> -->
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
