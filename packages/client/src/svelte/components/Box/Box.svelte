<script lang="ts">
  import BoxMap from "../Map/BoxMap.svelte"
  import { playerBox } from "../../modules/state"
</script>

<BoxMap width={$playerBox.width} height={$playerBox.height} />

<style>
  .box {
    position: fixed;
    top: 0;
    left: 0;
    padding: 40px;
    height: 100vh;
    width: 100vw;
    background-color: #444;
    font-size: 18px;
    z-index: 1000;
  }

  .icon {
    height: 50px;
    width: 50px;
  }
</style>
