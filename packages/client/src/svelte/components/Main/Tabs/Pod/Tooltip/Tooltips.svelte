<script lang="ts">
  import { inspecting } from "@modules/ui/stores"
  import Tooltip from "@components/Main/Tabs/Pod/Tooltip/Tooltip.svelte"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { UI_SCALE_FACTOR } from "@modules/ui/constants"
</script>

{#if $inspecting}
  <Tooltip>
    {#if $inspecting && $inspecting.products && $inspecting.products.length > 0}
      {#each $inspecting.products as product}
        {product.amount / UI_SCALE_FACTOR}
        {MATERIAL_TYPE[product.materialType]}<br />
      {/each}
    {/if}
  </Tooltip>
{/if}
