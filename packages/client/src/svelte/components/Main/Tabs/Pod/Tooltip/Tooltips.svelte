<script lang="ts">
  import { inspecting } from "@modules/ui/stores"
  import Tooltip from "@components/Main/Tabs/Pod/Tooltip/Tooltip.svelte"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
</script>

{#if $inspecting}
  <Tooltip>
    {#if $inspecting !== null}
      {#each $inspecting.products as product}
        Material: {MATERIAL_TYPE[product.materialType]}<br />
        Amount: {product.amount / 100}
      {/each}
    {/if}
  </Tooltip>
{/if}
