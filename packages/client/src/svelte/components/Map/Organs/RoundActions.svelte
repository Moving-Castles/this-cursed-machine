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
  import { connect, disconnect } from "../../../modules/action"
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
    connect(ConnectionType.RESOURCE, entity.address)
  }

  function sendDisconnectResource() {
    disconnect(ConnectionType.RESOURCE)
  }

  function sendConnectControl() {
    connect(ConnectionType.CONTROL, entity.address)
  }

  function sendDisconnectControl() {
    disconnect(ConnectionType.CONTROL)
  }

  const circularLayout = node => {
    node.style.cssText += `
    --child-count: ${node.children.length};
    --angle: ${360 / node.children.length}deg;
    --radius: ${radius}px;
    `
    return {}
  }
</script>


<!-- Actions should show up if there is a connection and should use disabled prop for validating if player can afford them -->
<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  transition:fade={{ duration: 100 }}
  use:circularLayout
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
    position: absolute;
    width: calc(var(--radius) * 2);
    height: calc(var(--radius) * 2);
    top: 0;
    left: 0;
    z-index: 999900000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);

    :global(.action) {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 80px;
      height: 80px;
      background-color: var(--background);
      border-radius: 100%;
    }

    :global(.action:nth-child(1)) {
      transform: translate(-50%, -50%) rotate(calc(var(--angle) * 0))
        translate(var(--radius)) rotate(calc(var(--angle) * 0)) rotate(-90deg);
    }
    :global(.action:nth-child(2)) {
      transform: translate(-50%, -50%) rotate(calc(var(--angle) * 1))
        translateX(var(--radius)) rotate(calc(var(--angle) * -1)) rotate(-90deg);
    }
    :global(.action:nth-child(3)) {
      transform: translate(-50%, -50%) rotate(calc(var(--angle) * 2))
        translate(var(--radius)) rotate(calc(var(--angle) * -2)) rotate(-90deg);
    }
    :global(.action:nth-child(4)) {
      transform: translate(-50%, -50%) rotate(calc(var(--angle) * 3))
        translate(var(--radius)) rotate(calc(var(--angle) * -3)) rotate(-90deg);
    }
    :global(.action:nth-child(5)) {
      transform: translate(-50%, -50%) rotate(calc(var(--angle) * 4))
        translate(var(--radius)) rotate(calc(var(--angle) * -4)) rotate(-90deg);
    }
    :global(.action:nth-child(6)) {
      transform: translate(-50%, -50%) rotate(calc(var(--angle) * 5))
        translate(var(--radius)) rotate(calc(var(--angle) * -5)) rotate(-90deg);
    }
    :global(.action:nth-child(7)) {
      transform: translate(-50%, -50%) rotate(calc(var(--angle) * 6))
        translate(var(--radius)) rotate(calc(var(--angle) * -6)) rotate(-90deg);
    }
  }
</style>
