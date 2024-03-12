<script lang="ts">
  import { inspecting } from "@modules/ui/stores"
  import Tooltip from "@components/Main/Tabs/Pod/Tooltip/Tooltip.svelte"
</script>

{#if $inspecting}
  <Tooltip>"TODO"</Tooltip>
{/if}
