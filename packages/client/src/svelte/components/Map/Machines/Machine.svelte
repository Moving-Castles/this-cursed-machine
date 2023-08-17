<script lang="ts">
  import { getContext } from "svelte"
  import {
    NULL_COORDINATE,
    dropDestination,
    playerEntityId,
    isDraggable,
    isConnectedResource,
    isConnectedControl,
  } from "../../../modules/state"
  import { MachineType } from "../../../modules/state/types"
  import Connectable from "../Connectable.svelte"
  import Actions from "./Actions.svelte"

  export let background = "rgb(255, 244, 0)"
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
<Connectable {entity}>
  <div
    draggable={$draggable}
    on:dragover|preventDefault
    style="--background: {background};"
    class="machine-wrapper {MachineType[entity.entity?.machineType]}"
  >
    <div
      class="content"
      on:click={openModal}
      class:resource={$isResourced}
      class:control={$isControlled}
    >
      <slot name="content" />
    </div>
  </div>
</Connectable>

{#if modalActive}
  <Actions {entity} {background} on:close={closeModal}>
    <slot name="modal" />
  </Actions>
{/if}

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
</style>
