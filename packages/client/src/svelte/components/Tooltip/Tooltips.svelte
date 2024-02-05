<script lang="ts">
  import { ENTITY_TYPE } from "../../modules/state/enums"
  import { inspecting } from "../../modules/ui/stores"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import ConnectionInformation from "../Connections/ConnectionInformation.svelte"
  import MachineInformation from "../Machines/MachineInformation.svelte"
</script>

{#if $inspecting}
  <Tooltip>
    {#if $inspecting?.entityType === ENTITY_TYPE.MACHINE}
      <MachineInformation address={$inspecting.address} machine={$inspecting} />
    {/if}
    {#if $inspecting?.entityType === ENTITY_TYPE.CONNECTION}
      <ConnectionInformation
        address={$inspecting.address}
        connection={$inspecting}
      />
    {/if}
  </Tooltip>
{/if}
