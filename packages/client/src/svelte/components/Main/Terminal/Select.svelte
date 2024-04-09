<script lang="ts">
  import type { SelectOption } from "@components/Main/Terminal/types"
  import { onMount, createEventDispatcher, tick, onDestroy } from "svelte"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import { playSound } from "@modules/sound"
  import { scrollToEnd } from "@components/Main/Terminal/functions/helpers"
  import { selectedOption } from "@modules/ui/stores"

  type ReturnFunction = (value: string | MACHINE_TYPE | null) => void

  export let returnFunction: ReturnFunction | null = null
  export let selectOptions: SelectOption[] = []

  // Add cancel option
  selectOptions = [...selectOptions, { label: "cancel", value: null }]

  const dispatch = createEventDispatcher()

  let selectedIndex = 0
  let selectContainerElement: HTMLDivElement

  $: {
    const v = selectOptions[selectedIndex]
    if (v) {
      selectedOption.set(v)
    } else {
      console.log("no v")
      selectedOption.set(false)
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
        playSound("tcm", "selectionScroll")
        selectedIndex = Math.max(selectedIndex - 1, 0)
        break
      case "ArrowDown":
        // Navigate to the next option
        playSound("tcm", "selectionScroll")
        selectedIndex = Math.min(selectedIndex + 1, selectOptions.length - 1)
        break
      case "Enter":
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
    selectContainerElement.focus()
    await tick()
    scrollToEnd()
  })

  onDestroy(() => {
    selectedOption.set(false)
  })
</script>

<svelte:window on:keydown={onKeyDown} />

{#if selectOptions.length > 0}
  <div class="inline-select" bind:this={selectContainerElement}>
    {#each selectOptions as option, index (option.value)}
      <div
        class:active={selectedIndex === index}
        class="option {option.label} option-{index}"
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
      opacity: 0;

      &.active {
        color: var(--background);
        background: var(--color-info);
        margin-left: 0;

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

    @keyframes showOpacity {
      0%,
      99% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @for $i from 0 through 50 {
      .option-#{$i} {
        animation: showOpacity #{$i * 60}ms linear;
        opacity: 1;
      }
    }
  }
</style>
