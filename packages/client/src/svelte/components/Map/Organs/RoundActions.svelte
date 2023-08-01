<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte"
  import { fade } from "svelte/transition"
  import {
    playerCore,
    playerCanAffordControl,
    playerCanAffordResource,
    isConnectedResourceAny,
    isConnectedControlAny
  } from "../../../modules/state"
  import { ConnectionType } from "../../../modules/state/types"
  import { EntityType } from "../../../modules/state/types"
  import { explainer } from "../../../modules/content/wiki"
  import { circularLayout } from "../../../modules/ui"
  // import { connect, disconnect } from "../../../modules/action"
  export let radius = 120
  export let entity: EntityStoreEntry

  const tile = getContext("tile")
  const dispatch = createEventDispatcher()
  const canAffordControl = playerCanAffordControl(tile.coordinates)
  const canAffordResource = playerCanAffordResource(tile.coordinates)
  const isResourced = isConnectedResourceAny(entity.address)
  const isControlled = isConnectedControlAny(entity.address)

  const close = () => dispatch("close")
  const openExplainer = () => ($explainer = EntityType[entity.entity.type])

  // Default actions
  function sendConnectResource() {
    // connect(ConnectionType.RESOURCE, entity.address)
    console.log('function doesnt exist')
  }

  function sendDisconnectResource() {
    // disconnect(ConnectionType.RESOURCE)
    console.log('function doesnt exist')
  }

  function sendConnectControl() {
    // connect(ConnectionType.CONTROL, entity.address)
    console.log('function doesnt exist')
  }

  function sendDisconnectControl() {
    // disconnect(ConnectionType.CONTROL)
    console.log('function doesnt exist')
  }
</script>


<!-- Actions should show up if there is a connection and should use disabled prop for validating if player can afford them -->
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  transition:fade={{ duration: 100 }}
  use:circularLayout={{ radius }}
  class="round-actions"
  on:mouseleave={close}
  on:dragleave={close}
>
  <!-- Direct connection to player core -->
  <slot name="resourceAction">
    {#if $playerCore.resourceConnection === entity.address}
      <button class="action" on:click={sendDisconnectResource}
        >Disconnect (Resource)</button
      >
    {:else if !$playerCore.resourceConnection}
      <button
        class="action"
        disabled={!$canAffordResource || $isResourced}
        on:click={sendConnectResource}>
        Connect (Resource): {$isResourced}
        </button
      >
    {/if}
  </slot>

  <!-- Direct connection to player core -->
  <slot name="controlAction">
    {#if $playerCore.controlConnection === entity.address}
      <button class="action" on:click={sendDisconnectControl}>
        Disconnect (Control)
      </button>
    {:else if !$playerCore.controlConnection}
      <button
        class="action"
        disabled={!$canAffordControl && !$isControlled}
        on:click={sendConnectControl}
        >Connect (Control)
      </button>
    {/if}
  </slot>

  <slot name="closeAction">
    <button class="action" on:click|stopPropagation={close}> Close </button>
  </slot>

  <slot name="explainAction">
    <button class="action" on:click|stopPropagation={openExplainer}> ? </button>
  </slot>

  <slot />
</div>

<style lang="scss">
  .round-actions {
    :global(.action) {
      width: 80px;
      height: 80px;
      background-color: var(--background);
      border-radius: 100%;
    }
  }
</style>
