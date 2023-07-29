<script lang="ts">
  import {
    calculatedEnergy,
    portal,
    claw,
    foodSource,
    cores,
  } from "../../modules/state"
  import { settle } from "../../modules/action"

  function sendSettle() {
    settle()
  }
</script>

<div class="raw-debug">
  <div>
    {#each Object.entries($cores) as [entityId, core]}
      <div>
        <hr />
        {core.name}: (x: {core?.position?.x}, y: {core?.position?.y}), calc.
        energy: {$calculatedEnergy[entityId]}, act. energy: {core.energy},
        startblock: {core.startBlock}, resourceConnection: {core.resourceConnection?.slice(
          -8
        )}, controlConnection: {core.controlConnection?.slice(-8)}
      </div>
    {/each}
  </div>
  <hr />
  <div>
    Claw: (x: {$claw.position?.x}, y: {$claw.position?.y}), energy: {$claw.energy}
  </div>
  <div>
    Food: (x: {$foodSource.position?.x}, y: {$foodSource.position?.y})
  </div>
  <div>
    Portal: (x: {$portal.position?.x}, y: {$portal.position?.y}), energy: {$portal.energy}
  </div>
  <button on:click={sendSettle}>Settle</button>
</div>

<style lang="scss">
  .raw-debug {
    background: red;
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 300px;
    height: 300px;
    z-index: 10000;
  }
</style>
