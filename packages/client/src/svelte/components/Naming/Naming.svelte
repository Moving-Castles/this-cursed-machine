<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { TerminalType, OutputType } from "../Terminal/types"
  import { SYMBOLS } from "../Terminal"
  import {
    typeWriteToTerminal,
    writeToTerminal,
  } from "../Terminal/functions/writeToTerminal"
  import { narrative } from "./narrative"
  import { playerEntity } from "../../modules/state"

  const dispatch = createEventDispatcher()

  let terminalComponent: any

  import Terminal from "../Terminal/Terminal.svelte"

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
      OutputType.ERROR,
      "Name must include at least one numeral and one special character. Maximum 24 characters long.",
      false,
      SYMBOLS[5],
    )
    terminalComponent.resetInput()
  }

  onMount(async () => {
    // Skip intro if player is completed or spawned
    if ($playerEntity && $playerEntity.level > 8) {
      await typeWriteToTerminal(
        OutputType.SPECIAL,
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
    terminalType={TerminalType.NAMING}
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
