<script lang="ts">
  import { dropDestination, potentialConnections } from "../../modules/state"
</script>

<div class="drag-state">
  Drop destination: x: {$dropDestination.x} y: {$dropDestination.y} <br />
</div>

<style>
  .drag-state {
    position: fixed;
    bottom: 0;
    right: 0;
    color: white;
    z-index: 9999;
  }
</style>
