<script lang="ts">
  import { fade } from "svelte/transition"
  import { onMount, createEventDispatcher } from "svelte"
  import { MachineType } from "../../modules/state/enums"
  import type { SelectOption } from "./types"
  import { playSound } from "../../modules/sound"

  type ReturnFunction = (value: string | MachineType | null) => void

  export let returnFunction: ReturnFunction | null = null
  export let selectOptions: SelectOption[] = []

  const dispatch = createEventDispatcher()

  let selectedIndex = 0
  let selectContainerElement: HTMLDivElement

  function returnValue(value: string | MachineType | null) {
    if (returnFunction) {
      // Returns the value to the function that created the component
      returnFunction(value)
    }
    // Signal the parent that the component wants to be destroyed.
    dispatch("requestDestroy")
  }

  /**
   * Handles key down events for navigation and selection within select options.
   *
   * This function is responsible for handling arrow key navigation within a list of options,
   * selecting an option with the Enter key, and closing the list without selecting with the Escape key.
   *
   * @param {KeyboardEvent} e - The key down event.
   */
  const onKeyDown = (e: KeyboardEvent) => {
    const { key } = e
    switch (key) {
      case "ArrowUp":
        // Navigate to the previous option
        playSound("ui", "cursor")
        selectedIndex = Math.max(selectedIndex - 1, 0)
        break
      case "ArrowDown":
        // Navigate to the next option
        playSound("ui", "cursor")
        selectedIndex = Math.min(selectedIndex + 1, selectOptions.length - 1)
        break
      case "Enter":
        // Select the current highlighted option
        returnValue(selectOptions[selectedIndex]?.value || null)
        break
      case "Escape":
        playSound("ui", "eventBad")
        // Close the options list without making a selection
        returnValue(null)
        break
    }
  }

  onMount(() => {
    console.log("selectOptions", selectOptions)
    // Abort if no options
    if (selectOptions.length === 0) {
      returnValue(null)
    }
    selectContainerElement.focus()
  })
</script>

<svelte:window on:keydown={onKeyDown} />

{#if selectOptions.length > 0}
  <div class="inline-select" bind:this={selectContainerElement}>
    {#each selectOptions as option, index (option.value)}
      <div
        class:active={selectedIndex === index}
        class="option"
        in:fade={{ duration: 100, delay: 50 * index }}
      >
        {option.label}
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  .inline-select {
    .option {
      color: #fff;
      margin-left: 2ch;
      height: 1.1em;

      &.active {
        color: #000;
        background: #fff;
        margin-left: 0;

        &::before {
          content: "> ";
        }
      }
    }
  }
</style>
