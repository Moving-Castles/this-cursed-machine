<script lang="ts">
  import { materialMetadata } from "@modules/state/base/stores";
  import { inspecting } from "@modules/ui/stores"
  import Tooltip from "@components/Main/Tabs/Pod/Tooltip/Tooltip.svelte"
  // import { UI_SCALE_FACTOR } from "@modules/ui/constants"
</script>

{#if $inspecting && $inspecting.products && $inspecting.products.length > 0}
  <Tooltip>
    {#each $inspecting.products as product}
      {$materialMetadata[product.materialId]?.name}<br />
    {/each}
  </Tooltip>
{/if}
