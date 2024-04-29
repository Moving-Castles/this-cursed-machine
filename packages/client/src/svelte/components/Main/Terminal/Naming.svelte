<script lang="ts">
  import { onMount, createEventDispatcher, tick } from "svelte"
  import { playSound } from "@modules/sound"
  import { scrollToEnd } from "@components/Main/Terminal/functions/helpers"
  import { SYMBOLS } from "@components/Main/Terminal"
  import { playInputSound } from "@components/Main/Terminal/functions/sound"

  type ReturnFunction = (value: string | null) => void

  export let returnFunction: ReturnFunction | null = null

  const dispatch = createEventDispatcher()

  let inputElement: HTMLInputElement
  let userInput = ""

  function isValidName(name: string): boolean {
    // Check for minimume length of 4
    const hasMinLength = name.length >= 4
    // Check for maximum length of 24
    const isLengthValid = name.length <= 24

    return hasMinLength && isLengthValid
  }

  function returnValue(value: string | null) {
    if (returnFunction) {
      // Returns the value to the function that created the component
      returnFunction(value)
    }
    // Signal the parent that the component wants to be destroyed.
    dispatch("requestDestroy")
  }

  const onInput = (e: KeyboardEvent) => {
    playInputSound(e)
  }

  const onSubmit = () => {
    // Validate name here
    playSound("tcm", "selectionEnter")
    returnValue(userInput)
  }

  onMount(async () => {
    inputElement.focus()
    await tick()
    scrollToEnd()
  })
</script>

<div class="naming-container">
  <form on:submit|preventDefault={onSubmit}>
    <span class="prompt-symbol">
      {SYMBOLS[1]}
    </span>
    <input
      class="terminal-input"
      type="text"
      placeholder="enter Name"
      on:keydown={onInput}
      bind:this={inputElement}
      bind:value={userInput}
    />
    <div
      class="blinker"
      class:blink={userInput.length === 0}
      class:empty={userInput === ""}
      style:transform="translate({userInput.length}ch, 0)"
    >
      █
    </div>
  </form>
</div>

<style lang="scss">
  form {
    font-family: var(--font-family);
    border: none;
    outline: none;
    left: 1em;
    display: flex;
    color: var(--color-info);

    .prompt-symbol {
      white-space: nowrap;
      vertical-align: middle;
      margin-right: 1ch;
      color: inherit;
    }

    input {
      caret-color: transparent;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      line-height: inherit;
      width: 60ch;
      max-width: 100%;
      background-color: inherit;
      border: none;
      padding: 0;
      position: relative; /* To position the pseudo-element */
      text-transform: uppercase;

      &::placeholder {
        opacity: 1;
        color: var(--color-grey-mid);
      }

      &:focus {
        border: none;
        outline: none;
      }
    }

    .blinker {
      opacity: 1;
      position: absolute;
      left: 3ch;
      display: inline-block;
      transform-origin: top left;
    }
  }
</style>
