<script lang="ts">
  import { inspecting } from "@modules/ui/stores"
  import Tooltip from "@components/Main/Tabs/Pod/Tooltip/Tooltip.svelte"
  import { MATERIAL_TYPE, MACHINE_TYPE } from "@modules/state/base/enums"

  $: console.log($inspecting)
</script>

{#if $inspecting}
  <Tooltip>
    <!-- @todo: maybe do cleaner -->
    {#if $inspecting.type === "connection"}
      {#each $inspecting.connection.products as product}
        Transporting: {MATERIAL_TYPE[product.materialType]}<br />
        Flow rate: {product.amount / 100}
      {/each}
    {:else if $inspecting.type === "machine"}
      {MACHINE_TYPE[$inspecting.machine.machineType]}<br />
      {#if $inspecting.machine?.products}
        {#each $inspecting.machine?.products as product}
          <div class="">
            Producing: {MATERIAL_TYPE[product.materialType]}<br />
            Flow rate: {product.amount / 100}
          </div>
        {/each}
      {/if}
    {/if}
  </Tooltip>
{/if}
