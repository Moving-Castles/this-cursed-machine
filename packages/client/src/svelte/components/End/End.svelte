<script lang="ts">
  import { playerAddress, playerCore } from "../../modules/state"
  import { addressToColor } from "../../modules/utils/misc"
</script>

<div class="box">
  <div
    class="icon"
    style={"background: " + addressToColor($playerAddress) + ";"}
  />
  <div>Core address: {$playerAddress}</div>
  <div>Core name: {$playerCore.name}</div>
  <div>Core creation block: {$playerCore.creationBlock}</div>
  <div>Core level: {$playerCore.level}</div>
  <hr />
  <div>END / LOBBY / VOID / ETC....</div>
  <hr />
</div>

<style>
  .box {
    position: fixed;
    top: 0;
    left: 0;
    padding: 40px;
    height: 100vh;
    width: 100vw;
    background-color: #4bff6c;
    font-size: 18px;
    z-index: 1000;
    color: black;
  }
</style>
