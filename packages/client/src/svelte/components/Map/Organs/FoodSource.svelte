<script lang="ts">
  import { originAddress, entities, isConnectedResource, playerEntityId, playerCore } from "../../../modules/state"
  import { connect, disconnect } from "../../../modules/action"
  import { EntityType } from "../../../modules/state/types"

  export let entity: EntityStoreEntry

  const isResourced = isConnectedResource($playerEntityId, [entity.address])

  const originEntity = $entities[$originAddress]

  // Drag incoming from specific organs
  $: showConnectModifier = originEntity ? EntityType[originEntity.type] === "MODIFIER" : false
  $: showConnectResourceSplit = originEntity ? EntityType[originEntity.type] === "RESOURCE_SPLIT" : false
  // It's a direct connection to resource
  // TODO: Find out what the connection path is if multiple things are connected
  // $: directConnectionResource = $playerCore.resourceConnection === entity.address
</script>

<!-- This action is for connecting the modifier -->
<!-- Show when the originAddress tile contains a modifier organ -->

{#if !directConnectionResource}
  {#if $isResourced && showConnectModifier}
    <button class="action" on:click={() => disconnect($originAddress)}
      >Disconnect modifier (Resource)</button
    >
  {:else if originEntity && showConnectModifier}
    <button
      class="action"
      on:click={() => connect(entity.entity.type, $originAddress, entity.address)}>Connect modifier (Resource)</button
    >
  {/if}

  <!--  -->
  {#if $isResourced && showConnectResourceSplit}
    <button class="action" on:click={() => disconnect($originAddress)}
      >Disconnect Resource Split (Resource)</button
    >
  {:else if originEntity && showConnectResourceSplit}
    <button
      class="action"
      on:click={() => connect(entity.entity.type, $originAddress, entity.address)}>Connect Resource Split (Resource)</button
    >
  {/if}
{/if}