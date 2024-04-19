<script lang="ts">
  import type { SelectOption } from "@components/Main/Terminal/types"
  import { onMount, createEventDispatcher, tick, onDestroy } from "svelte"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import { playSound } from "@modules/sound"
  import { scrollToEnd } from "@components/Main/Terminal/functions/helpers"
  import { selectedOption, selectedParameters } from "@modules/ui/stores"

  type ReturnFunction = (value: string | MACHINE_TYPE | null) => void

  export let returnFunction: ReturnFunction | null = null
  export let selectOptions: SelectOption[] = []

  // Add cancel option
  selectOptions = [
    ...selectOptions,
    { label: "cancel", value: null, available: true },
  ]

  let shownSelectOptions: SelectOption[] = []

  const dispatch = createEventDispatcher()

  let selectedIndex = 0
  let selectContainerElement: HTMLDivElement

  $: {
    const v = selectOptions[selectedIndex]
    if (v) {
      selectedOption.set(v)
    }
  }

  function returnValue(value: string | MACHINE_TYPE | null) {
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
        selectedIndex = Math.max(selectedIndex - 1, 0)
        if (selectOptions[selectedIndex]?.available) {
          playSound("tcm", "selectionScroll")
        } else {
          playSound("tcm", "listPrint")
        }
        break
      case "ArrowDown":
        // Navigate to the next option
        selectedIndex = Math.min(selectedIndex + 1, selectOptions.length - 1)
        if (selectOptions[selectedIndex]?.available) {
          playSound("tcm", "selectionScroll")
        } else {
          playSound("tcm", "listPrint")
        }
        break
      case "Enter":
        if (!selectOptions[selectedIndex]?.available) {
          playSound("tcm", "listPrint")
          break
        }
        if (selectOptions[selectedIndex]?.value === null) {
          playSound("tcm", "selectionEsc")
          // Close the options list without making a selection
          returnValue(null)
          break
        }
        playSound("tcm", "selectionEnter")
        // Select the current highlighted option
        returnValue(selectOptions[selectedIndex]?.value ?? null)
        break
      case "Escape":
        playSound("tcm", "selectionEsc")
        // Close the options list without making a selection
        returnValue(null)
        selectedIndex = -1
        break
    }
  }

  onMount(async () => {
    // Abort if no options
    if (selectOptions.length === 0) {
      returnValue(null)
    }

    // Entry animation
    for (let i = 0; i < selectOptions.length; i++) {
      playSound("tcm", "listPrint")
      shownSelectOptions = [...shownSelectOptions, selectOptions[i]]
      scrollToEnd()
      await new Promise(resolve => setTimeout(resolve, 20))
    }

    selectContainerElement.focus()
    await tick()
    scrollToEnd()
  })

  onDestroy(() => {
    selectedOption.set(false)
    selectedParameters.set([])
  })
</script>

<svelte:window on:keydown={onKeyDown} />

{#if selectOptions.length > 0}
  <div class="inline-select" bind:this={selectContainerElement}>
    {#each shownSelectOptions as option, index (option.value)}
      <div
        class:active={selectedIndex === index}
        class="option {option.label}"
        class:disabled={!option.available}
      >
        {option.label}
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  .inline-select {
    .option {
      color: var(--foreground);
      margin-left: 2ch;
      height: 1.1em;
      white-space: nowrap; /* Ensure no line breaks inside the element */
      overflow: hidden; /* Hide the overflow text */
      text-overflow: ellipsis; /* Add ellipses at the end of the text */
      opacity: 1;

      &.disabled {
        color: var(--color-grey-dark);
      }

      &.active {
        color: var(--background);
        background: var(--color-info);
        margin-left: 0;

        &.disabled {
          background: var(--color-grey-mid);
        }

        &::before {
          content: "> ";
        }
      }

      &.cancel {
        &::after {
          content: " [ESC]";
        }

        &.active {
          color: var(--background);
          background: var(--color-failure);

          &::before {
            content: "x ";
          }
        }
      }
    }
  }
</style>
