<script lang="ts">
  import { connections } from "../../modules/state"
</script>

{#each Object.entries($connections) as [address, connection], i (connection)}
  {address}: {connection}
{/each}
