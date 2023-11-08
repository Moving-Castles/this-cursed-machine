<script lang="ts">
  import { EntityType } from "../../modules/state/enums"
  import { inspecting } from "../../modules/ui/stores"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import ConnectionInformation from "../Connections/ConnectionInformation.svelte"
  import MachineInformation from "../Machines/MachineInformation.svelte"
</script>

{#if $inspecting}
  <Tooltip>
    {#if $inspecting?.entityType === EntityType.MACHINE}
      <MachineInformation address={$inspecting.address} machine={$inspecting} />
    {/if}
    {#if $inspecting?.entityType === EntityType.CONNECTION}
      <ConnectionInformation
        address={$inspecting.address}
        connection={$inspecting}
      />
    {/if}
  </Tooltip>
{/if}
