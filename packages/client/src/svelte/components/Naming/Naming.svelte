<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import {
    TERMINAL_TYPE,
    TERMINAL_OUTPUT_TYPE,
  } from "@components/Main/Terminal/enums"
  import { SYMBOLS } from "@components/Main/Terminal"
  import {
    typeWriteToTerminal,
    writeToTerminal,
  } from "@components/Main/Terminal/functions/writeToTerminal"
  import { narrative } from "@components/Naming/narrative"
  import { player } from "@modules/state/base/stores"

  const dispatch = createEventDispatcher()

  let terminalComponent: any

  import Terminal from "@components/Main/Terminal/Terminal.svelte"

  function isValidName(name: string): boolean {
    // Regex to check for at least one numeral
    const hasNumeral = /\d/.test(name)
    // Regex to check for any character that is not a letter
    const hasSpecialChar = /[^A-Za-z]/.test(name)
    // Check for maximum length of 24
    const isLengthValid = name.length <= 24

    return hasNumeral && hasSpecialChar && isLengthValid
  }

  const handleCommand = async (e: any) => {
    if (e.detail?.userInput && isValidName(e.detail.userInput)) {
      await narrative[1](e.detail.userInput)
      dispatch("named")
      return
    }

    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.ERROR,
      "Name must include at least one numeral and one special character. Maximum 24 characters long.",
      false,
      SYMBOLS[5],
    )
    terminalComponent.resetInput()
  }

  onMount(async () => {
    // Skip intro if player is completed or spawned
    if ($player && $player.level > 8) {
      await typeWriteToTerminal(
        TERMINAL_OUTPUT_TYPE.SPECIAL,
        `Loading dashboard...`,
        SYMBOLS[7],
        10,
        1000,
      )
      dispatch("named")
    } else {
      await narrative[0]("")
      terminalComponent.resetInput()
    }
  })
</script>

<div class="naming">
  <Terminal
    bind:this={terminalComponent}
    terminalType={TERMINAL_TYPE.NAMING}
    placeholder="ENTER NAME"
    setBlink
    on:commandExecuted={e => handleCommand(e)}
  />
</div>

<style>
  .naming {
    position: fixed;
    inset: 0;
    background-color: black;
    background-size: cover;
    background-position: center;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-items: center;
    user-select: none;
    cursor: pointer;
  }

  :global(p.normal) {
    margin-bottom: 1rem;
  }
</style>
