<script lang="ts">
  import { dragOrigin, tileEntity, isConnectedResource, playerEntityId, playerCore } from "../../../modules/state"
  import { EntityType } from "../../../modules/state/types"
  import { connectModifier, disconnectModifier } from "../../../modules/action"

  export let entity: EntityStoreEntry

  const isResourced = isConnectedResource($playerEntityId, [entity.address])

  const originEntity = tileEntity($dragOrigin)

  // Drag incoming from specific organs
  $: showConnectModifier = $originEntity ? EntityType[$originEntity.entity.type] === "MODIFIER" : false
  $: showConnectResourceSplit = $originEntity ? EntityType[$originEntity.entity.type] === "RESOURCE_SPLIT" : false
  // It's a direct connection to resource
  $: directConnectionResource = $playerCore.resourceConnection === entity.address
</script>

<!-- This action is for connecting the modifier -->
<!-- Show when the dragOrigin tile contains a modifier organ -->

{#if !directConnectionResource}
  {#if $isResourced && showConnectModifier}
    <button class="action" on:click={() => disconnectModifier($originEntity.address)}
      >Disconnect modifier (Resource)</button
    >
  {:else if $originEntity && showConnectModifier}
    <button
      class="action"
      on:click={() => connectModifier($originEntity.address, entity.address)}>Connect modifier (Resource)</button
    >
  {/if}

  <!--  -->
  {#if $isResourced && showConnectResourceSplit}
    <button class="action" on:click={() => disconnectModifier($originEntity.address)}
      >Disconnect Resource Split (Resource)</button
    >
  {:else if $originEntity && showConnectResourceSplit}
    <button
      class="action"
      on:click={() => connectModifier($originEntity.address, entity.address)}>Connect Resource Split (Resource)</button
    >
  {/if}
{/if}