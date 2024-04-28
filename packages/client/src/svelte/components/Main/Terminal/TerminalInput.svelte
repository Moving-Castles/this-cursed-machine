<script lang="ts">
  import { onMount } from "svelte"
  import { SYMBOLS } from "@components/Main/Terminal"

  export let onSubmit: () => void
  export let onFocus: () => void = () => {}
  export let onBlur: () => void = () => {}
  export let onInput: (e: KeyboardEvent) => void = () => {}
  export let placeholder: string
  export let inputElement: HTMLInputElement
  export let value: string

  let outerElement: HTMLFormElement
  let maxLength = 1

  // $: maxLength = clientWidth / 6

  let localInputElement: HTMLInputElement

  $: inputElement = localInputElement

  onMount(() => {
    const width = outerElement.clientWidth
    const CHARACTER_SIZE = 14

    maxLength = width / CHARACTER_SIZE - 2
  })
</script>

<form bind:this={outerElement} on:submit|preventDefault={onSubmit}>
  <span class="prompt-symbol">
    {SYMBOLS[0]}
  </span>
  <input
    class="terminal-input"
    type="text"
    on:focus={onFocus}
    on:blur={onBlur}
    on:keydown={onInput}
    {placeholder}
    bind:this={inputElement}
    bind:value
  />
  <div
    class="blinker"
    class:blink={value.length === 0}
    class:empty={value === ""}
    style:transform="translate({Math.min(value.length, maxLength)}ch, 0)"
  >
    █
  </div>
</form>

<style lang="scss">
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

  form {
    font-family: var(--font-family);
    border: none;
    outline: none;
    left: 1em;
    display: flex;

    .prompt-symbol {
      white-space: nowrap;
      vertical-align: middle;
      margin-right: 1ch;
      color: inherit;
    }
  }

  .blinker {
    opacity: 1;
    position: absolute;
    left: 3ch;
    display: inline-block;
    transform-origin: top left;
  }
</style>
