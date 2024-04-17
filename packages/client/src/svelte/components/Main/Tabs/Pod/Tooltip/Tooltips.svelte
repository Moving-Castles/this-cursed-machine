<script lang="ts">
  import { inspecting } from "@modules/ui/stores"
  import Tooltip from "@components/Main/Tabs/Pod/Tooltip/Tooltip.svelte"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  // import { UI_SCALE_FACTOR } from "@modules/ui/constants"
</script>

{#if $inspecting && $inspecting.products && $inspecting.products.length > 0}
  <Tooltip>
    {#each $inspecting.products as product}
      {MATERIAL_TYPE[product.materialType]}<br />
    {/each}
  </Tooltip>
{/if}
