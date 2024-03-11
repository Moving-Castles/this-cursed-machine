<script lang="ts">
  import { ENTITY_TYPE } from "@modules/state/base/enums"
  import { inspecting } from "@modules/ui/stores"
  import Tooltip from "@components/Main/Tabs/Pod/Tooltip/Tooltip.svelte"
  import ConnectionInformation from "@components/Main/Tabs/Pod/Tooltip/ConnectionInformation.svelte"
  import MachineInformation from "@components/Main/Tabs/Pod/Tooltip/MachineInformation.svelte"
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
