<script lang="ts">
  import { onMount } from "svelte"
  import { typewriter } from "../../modules/ui/transitions"
  export let sequence: string[]
  export let speed = 80

  let index = -1
  let userInput = ""
  let currentText = ""

  onMount(() => (index = 0))

  const next = () => {
    if (index < sequence.length - 1) {
      index = ++index
    }
  }

  const onSubmit = e => {
    console.log("e!!!!!!!!!")
    currentText += `\n${userInput}`
    userInput = ""
  }

  $: {
    currentText = sequence[index]
  }
</script>

<div class="terminal" on:click={next}>
  {#key index}
    <div class="terminal-output" in:typewriter={{ speed }}>
      <p class="output-content">
        {currentText}
      </p>
    </div>
  {/key}
  <form on:submit|preventDefault={onSubmit}>
    e: 100
    <input
      type="text"
      class="terminal-input"
      placeholder="Start typing"
      bind:value={userInput}
    />
  </form>
</div>

<style lang="scss">
  .terminal {
    font-family: monospace;
    border: 1px dashed yellow;
    padding: 0 1.5rem;
    color: yellow;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: black;
    overflow: hidden;

    * {
      &::selection {
        background: yellow;
        color: black;
      }
    }
  }

  .terminal-output {
    height: 24rem;
    width: 60ch;
    white-space: pre-wrap;
    vertical-align: text-bottom;
    display: flex;
    flex-flow: column nowrap;
    line-height: 1.5rem;
    justify-content: end;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .terminal-input {
    font-family: monospace;
    background: #000;
    color: yellow;
    height: 3rem;
    padding: 0;
    line-height: 2rem;
    font-size: 1rem;
    border: none;
    outline: none;
    width: 60ch;
  }

  .output-content {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>
