<script lang="ts">
  import { getContext } from "svelte"
  export let background = "rgb(255, 244, 0)"
  import { NULL_COORDINATE, dropDestination, playerEntityId, isDraggable, isConnectedResource, isConnectedControl } from "../../../modules/state"
  import { EntityType } from "../../../modules/state/types"
  import { onDragStart } from "../../../modules/ui/events"
  import RoundActions from "./RoundActions.svelte"

  const tile = getContext("tile") as GridTile
  let modalActive = false

  const draggable = true

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
  draggable={draggable}
  on:dragenter|preventDefault={openModal}
  on:dragover|preventDefault
  on:click={openModal}
  style="--background: {background};"
  class="organ-wrapper {tile.type}"
>
  <div
    class="content"
    >
    <slot name="content" />
  </div>
</div>

<style lang="scss">
  .modal {
    position: fixed;
    inset: 0;
  }
  .organ-wrapper {
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
</style>
