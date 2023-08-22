<script lang="ts">
  import { onMount, createEventDispatcher, tick } from "svelte"
  import { typewriter } from "../../modules/ui/transitions"
  export let sequence: string[]
  export let speed = 80

  let index = -1
  let energy = 100
  let userInput = ""
  let currentText = ""
  let skip = false
  let complete = false

  onMount(() => (index = 0))

  const dispatch = createEventDispatcher()

  const next = (override = false) => {
    console.log("next,", complete)
    // First skip, then increment
    if (index < sequence.length) {
      if ((complete && index < sequence.length - 1) || override) {
        index = ++index
        skip = false
      } else {
        skip = true
      }
    }

    if (index === sequence.length - 1) dispatch("done")
  }

  const introStart = () => {
    complete = false
  }
  const introEnd = () => {
    complete = true
  }

  const onSubmit = async () => {
    if (userInput === "n") {
      next(true)
    } else {
      currentText += `\n${userInput}`
    }
    userInput = ""
  }

  $: {
    currentText = sequence[index]
  }
</script>

<div class="terminal">
  {#key index + (skip ? "-skip" : "")}
    <div class="terminal-output" on:click={next}>
      <p
        in:typewriter={{ speed: skip ? 0 : speed }}
        on:introstart={introStart}
        on:introend={introEnd}
        class="output-content"
      >
        {currentText}
      </p>
    </div>
  {/key}
  <form on:submit|preventDefault={onSubmit}>
    e: {energy}
    <input
      type="text"
      class="terminal-input"
      placeholder="Start typing ([n] for next)"
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
