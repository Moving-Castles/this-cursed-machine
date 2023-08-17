<script lang="ts">
  import { getContext } from "svelte"
  export let background = "rgb(255, 244, 0)"
  import {
    NULL_COORDINATE,
    dropDestination,
    playerEntityId,
    isDraggable,
    isConnectedResource,
    isConnectedControl,
  } from "../../../modules/state"
  import { MachineType } from "../../../modules/state/types"
  import Actions from "./Actions.svelte"

  export let entity: EntityStoreEntry

  const tile = getContext("tile") as GridTile
  let modalActive = false

  const draggable = isDraggable(entity.address)
  const isResourced = isConnectedResource($playerEntityId, [entity.address])
  const isControlled = isConnectedControl($playerEntityId, [entity.address])

  function closeModal() {
    modalActive = false
  }
  function openModal() {
    if ($$slots.modal) {
      modalActive = true
    }
  }

  $: if (!modalActive) dropDestination.set(NULL_COORDINATE)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  draggable={$draggable}
  on:dragover|preventDefault
  on:click={openModal}
  style="--background: {background};"
  class="machine-wrapper {MachineType[entity.entity?.machineType]}"
>
  <div
    class="content rotate-{entity.entity?.rotation}"
    class:resource={$isResourced}
    class:control={$isControlled}
  >
    <slot name="content" />
  </div>

  {#if modalActive}
    <Actions {entity} on:close={closeModal}>
      <slot name="modal" />
    </Actions>
  {/if}
</div>

<style lang="scss">
  .modal {
    position: fixed;
    inset: 0;
  }
  .machine-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .content {
      overflow: hidden;
      width: 80%;
      height: 80%;
      border-radius: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: black;
      cursor: pointer;
      z-index: 10000;
      font-weight: bold;
      cursor: pointer;
      position: relative;
      background: var(--background);

      &.control {
        border: 3px solid blue;
      }

      &.resource {
        border: 3px solid red;
      }

      &.control.resource {
        border: 3px solid red;
        outline: 3px solid blue;
      }

      .ports {
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 100%;

        .connected-resource {
          background: red;
        }

        .connected-control {
          background: blue;
        }

        .port {
          position: absolute;
          width: 10px;
          height: 10px;
          background: lightgrey;
        }

        .north {
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .east {
          top: 50%;
          right: 0;
          transform: translate(50%, -50%);
        }
        .south {
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
        }
        .west {
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  .modal {
    pointer-events: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 400px;
    height: 300px;
    background: inherit;
    color: black;
    z-index: 100000;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    :global(button) {
      border: 1px solid red;
      pointer-events: auto;
    }

    button {
      margin-bottom: 10px;
      width: 200px;
    }
  }

  .rotate-0 {
    transform: rotate(0deg);
  }
  .rotate-90 {
    transform: rotate(90deg);
  }
  .rotate-180 {
    transform: rotate(180deg);
  }
  .rotate-270 {
    transform: rotate(270deg);
  }
</style>
