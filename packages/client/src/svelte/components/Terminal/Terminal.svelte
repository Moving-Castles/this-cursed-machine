<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte"
  import lodash from "lodash"
  const { throttle } = lodash
  import { playSound } from "../../modules/sound"
  import {
    advance,
    output,
    sequence as seq,
    index,
    parsed,
    handleClick,
    handleAction,
    betweenSquareBrackets,
  } from "./index"
  export let sequence: string[] = []
  export let speed = 80
  export let theme = "dark"
  export let placeholder = "Start typing"
  export let loop = false
  export let track = true
  export let input = false
  export let stage = true // display the terminal centered and front stage
  export let animated = false
  const symbols = [
    "›",
    "»",
    "*",
    "+",
    "‡",
    "†",
    "+",
    "◊",
    "”",
    "%",
    "#",
    "«",
    "¥",
  ]

  /** Init */
  if (!input) seq.set(sequence)

  /** Constants */
  const themeOptions = ["dark", "light", "transparent"]
  const dispatch = createEventDispatcher()

  /** Variables */
  let inputElement: HTMLElement
  let outputElement: HTMLElement
  let energy = -1
  let userInput = ""
  let skip = false
  let complete = false
  let interval = false

  const onWheel = throttle(e => {
    const step = 18
    const pos = outputElement.scrollTop
    const nextPos = pos + step * -Math.sign(e.deltaY)
    console.log(e.deltaY)
    outputElement.scrollTop = nextPos
  }, 40)

  const send = async (string: string) => {
    output.set([...$output, string])
    await tick()
    outputElement.scrollTop = outputElement.scrollTop + 10000
  }

  /** Next! */
  const next = (override = false) => {
    // First skip, then increment
    if ($index < $seq.length) {
      if ((complete && $index < $seq.length - 1) || override) {
        $index = ++$index
        skip = false
      } else {
        skip = true
        clearInterval(interval)
      }
    }

    if ($index === $seq.length - 1) {
      if (loop) {
        $index = 0
      } else {
        dispatch("done", userInput)
      }
    }
  }

  /** The submit function */
  const onSubmit = async () => {
    skip = false

    const args = userInput.match(betweenSquareBrackets)

    if (userInput === "") {
      // next()
      // advance("A")
    } else if (userInput === "show") {
      dispatch("show")
    } else {
      send(`${symbols[2]} ${userInput}`)
      playSound("ui", "selectFour")
    }
    userInput = ""
  }

  /** Reactive statements */
  // Key for transitions
  $: key = $index + (skip ? "-skip" : "")
  // Set output
  $: {
    // let t = $seq[$index]
    // if (t) $output = [...$output, t]
  }
  $: {
    if (theme === "dark") {
      // document.documentElement.style.setProperty(
      //   "--terminal-background",
      //   "black"
      // )
      // document.documentElement.style.setProperty("--terminal-color", "yellow")
      // document.documentElement.style.setProperty(
      //   "--terminal-border",
      //   ""
      // )
    }
  }

  /** Lifecycle hooks */
  onMount(() => {
    inputElement.focus()
    $index = 0

    // setInterval(() => {
    //   send(`${symbols[7]} system messgae`)
    // }, 2000)
  })

  onDestroy(() => index.set(-1))
</script>

<div class="terminal" class:stage>
  {#if !input}
    {#if track}
      <p class="track">
        {$index} / {$seq.length}
      </p>
    {/if}
    {#key key}
      <div bind:this={outputElement} class="terminal-output" on:wheel={onWheel}>
        {#each $output as o, i (i)}
          <p class="output-content">
            {@html parsed(o)}
          </p>
        {/each}
      </div>
    {/key}
  {/if}

  <form class="terminal-input" on:submit|preventDefault={onSubmit}>
    {#if !input}
      <span class="player-stats">
        {symbols[0]}
      </span>
    {/if}
    <input
      type="text"
      {placeholder}
      bind:this={inputElement}
      bind:value={userInput}
    />
  </form>
</div>

<style lang="scss">
  .terminal {
    font-family: var(--font-family);
    padding: 0 1.5rem;
    overflow: hidden;
    transition: background 2s ease, color 2s ease;
    border: var(--terminal-border);
    color: var(--terminal-color);
    background: var(--terminal-background);
    width: 100%;
    position: relative;
    height: 100%;

    &.stage {
      position: fixed;
      left: 0;
      top: 0;
      width: 400px;
    }

    .track {
      position: absolute;
      right: 1rem;
      pointer-events: none;
    }

    * {
      &::selection {
        background: var(--terminal-color);
        color: var(--terminal-background);
      }
    }

    .terminal-output {
      height: calc(100% - 1.5rem);
      white-space: pre-wrap;
      overflow: hidden;
      line-height: 1.5rem;
    }
    .terminal-input {
      background: var(--terminal-background);
      color: var(--terminal-color);
      font-family: var(--font-family);
      padding: 0;
      line-height: 2rem;
      font-size: 1rem;
      border: none;
      outline: none;
      position: absolute;
      bottom: 0;
      left: 1.5rem;
      height: 1.5rem;
      transition: background 2s ease, color 2s ease;
      display: flex;
      z-index: 999;

      .player-stats {
        white-space: nowrap;
        vertical-align: middle;
        line-height: 1.5rem;
      }

      input {
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        line-height: inherit;
        width: 60ch;
        max-width: 100%;
        background-color: inherit;
        border: none;
        padding: 0 1ch;

        &:focus {
          border: none;
          outline: none;
        }
      }
    }
  }

  .output-content {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>
