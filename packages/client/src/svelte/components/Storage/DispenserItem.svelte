<script lang="ts">
  import { MaterialType } from "../../modules/state/enums"
  import { dispenser } from "../../modules/state"
  import { playerPod } from "../../modules/state"

  const getConnectionName = (machineEntity: string) => {
    if (machineEntity === $playerPod.fixedEntities.inlet) return "Inlet"
    if (machineEntity === $playerPod.fixedEntities.outlet) return "Outlet"
    return "none"
  }
</script>

<div class="dispenser-item">
  <div><strong>Dispenser</strong></div>
  <div>M: {MaterialType[$dispenser.materialType]}</div>
  <div>A: {$dispenser.amount}</div>
  <div>C: {getConnectionName($dispenser.storageConnection)}</div>
</div>

<style lang="scss">
  .dispenser-item {
    border: 1px solid #fff;
    margin-right: 20px;
    width: 30%;
    padding-bottom: 5px;
    margin-bottom: 10px;
    overflow: hidden;
    padding: 10px;
    background: #40b8b2;
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
