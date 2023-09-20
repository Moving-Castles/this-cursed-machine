<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from "svelte"
  import { typewriter } from "../../modules/ui/transitions"
  import {
    showFlowChart,
    showPipeChart,
    showCores,
  } from "../../modules/ui/stores"
  import { narrative } from "../../modules/content/lore"
  import { playSound } from "../../modules/sound"
  import { playerCalculatedEnergy } from "../../modules/state"
  import {
    advance,
    output,
    sequence as seq,
    index,
    parsed,
    handleClick,
    handleAction,
    argsTest,
  } from "./index"
  export let sequence: string[] = []
  export let speed = 80
  export let theme = "dark"
  export let placeholder = "Start typing ([ENTER] for next, [s] to skip intro)"
  export let loop = false
  export let track = true
  export let input = false
  export let stage = true // display the terminal centered and front stage
  export let animated = false

  /** Init */
  if (!input) seq.set(sequence)

  /** Constants */
  const themeOptions = ["dark", "light", "transparent"]
  const dispatch = createEventDispatcher()

  /** Variables */
  let inputElement: HTMLElement
  let energy = -1
  let userInput = ""
  let skip = false
  let complete = false
  let interval = false

  /** Transition callbacks */
  const introStart = () => {
    interval = setInterval(() => {
      playSound("ui", "cursor")
    }, speed * 0.666)
    const actions = document.querySelectorAll(".inline-action")

    for (let action of actions) {
      action.addEventListener("click", handleClick)
    }
    complete = false
  }
  const introEnd = () => {
    complete = true
    clearInterval(interval)
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

    const args = userInput.match(argsTest)

    if (input) {
      dispatch("done", userInput)
      placeholder = "loading..."
    }

    if (userInput === "") {
      next()
    } else if (userInput.includes("theme")) {
      // Check for one of the options in the string
      const t = themeOptions.find(tt => userInput.includes(tt))
      if (t) theme = t
    } else if (userInput === "s") {
      dispatch("done")
    } else if (userInput === "m") {
      handleAction("Add", ["machine"])
    } else if (userInput === "p") {
      handleAction("Add", ["pipe"])
    } else if (userInput === "f") {
      $showFlowChart = true
    } else if (userInput === "pp") {
      $showPipeChart = true
    } else if (userInput === "cc") {
      $showCores = true
    } else if (userInput === "wink") {
      advance(`
@@@@@@@@@@@@@@@%&&&@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@%%(%%%#(%%#%%&%@@@@@@@@@@@@
@@@@@@@@@@@@@#%@@@@@##%&#%##@@@@@@@@@@@@
@@@@@@@@@@@@@&&@@@@%#((&##%#@@@@@@@@@@@@
@@@@@@@@@@@@@&&%&//((/ ./# @@@@@@@@@@@@@
@@@@@&%&&&&&&&*/#..%*.(#,*./@@@@@@@@@@@@
@@@@@%%&&&*,((*&(//&(/#&//%#&%%%@@@@@@@@
@@@@@@@@@/((%##%#(.,*/((/,,,/&&%#%@@@@@@
@@@@@@,..@/*((/((/(*,*#&&%#(%%%@@@@@@@@@
@@@@@*,*#@&@@@&&&&@@@&&&&&@/#&@@@@@@@@@@
@@@@@, (.,(/%@&&&&@#/@&&&@(#/@@@@@@@@@@@
@@@@/ ,@@@(&//***/((#(###%%&(@@@,,@@@@@@
@@@@@@@@@@##%#(*...,.*,%&(@@@@@@/.  @@@@
@@@@@@@@@@@@@@@@@%@@%&%@@@@@@@@/#*  *@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@**(@@@@
`)
    } else if (userInput === "h") {
      advance($narrative.help)
    } else if (userInput.toLowerCase().includes("new")) {
      if (args) {
        handleAction("New", args)
      } else {
        advance(
          "! Make sure to include arguments between brackets: [LIKE THIS]"
        )
      }
    } else if (userInput.toLowerCase().includes("from")) {
      if (args) {
        handleAction("From", args)
      } else {
        advance(
          "! Make sure to include arguments between brackets: [LIKE THIS]"
        )
      }
    } else if (userInput.toLowerCase().includes("to")) {
      if (args) {
        handleAction("To", args)
      } else {
        advance(
          "! Make sure to include arguments between brackets: [LIKE THIS]"
        )
      }
    } else {
      advance(userInput)
    }
    userInput = ""
  }

  /** Reactive statements */
  // Key for transitions
  $: key = $index + (skip ? "-skip" : "")
  // Set output
  $: {
    let t = $seq[$index]
    if (t) $output = t
  }
  $: {
    if (theme === "dark") {
      document.documentElement.style.setProperty(
        "--terminal-background",
        "black"
      )
      document.documentElement.style.setProperty("--terminal-color", "yellow")
      document.documentElement.style.setProperty(
        "--terminal-border",
        "1px dashed yellow"
      )
    }
    if (theme === "light") {
      document.documentElement.style.setProperty(
        "--terminal-background",
        "white"
      )
      document.documentElement.style.setProperty("--terminal-color", "black")
      document.documentElement.style.setProperty(
        "--terminal-border",
        "1px dashed black"
      )
    }
  }

  /** Lifecycle hooks */
  onMount(() => {
    inputElement.focus()
    $index = 0
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
      <div class="terminal-output">
        <p
          in:typewriter={{ speed: skip || !animated ? 0 : speed }}
          on:introstart={introStart}
          on:introend={introEnd}
          class="output-content"
        >
          {@html parsed($output)}
        </p>
      </div>
    {/key}
  {/if}
  <form class="terminal-input" on:submit|preventDefault={onSubmit}>
    {#if !input}
      <span class="player-stats">
        e: {$playerCalculatedEnergy}
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
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 3rem;
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
      height: calc(100% - 3rem);
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
      background: var(--terminal-background);
      color: var(--terminal-color);
      font-family: var(--font-family);
      height: 3rem;
      padding: 0;
      line-height: 2rem;
      font-size: 1rem;
      border: none;
      outline: none;
      position: absolute;
      bottom: 0;
      left: 1.5rem;
      transition: background 2s ease, color 2s ease;
      display: flex;
      z-index: 999;

      .player-stats {
        white-space: nowrap;
        vertical-align: middle;
        line-height: 3rem;
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
        padding-left: 1rem;

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
