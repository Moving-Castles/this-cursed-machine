<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { COMMAND, TerminalType, OutputType } from "../Terminal/types"
  import { SYMBOLS } from "../Terminal"
  import { typeWriteToTerminal } from "../Terminal/functions/writeToTerminal"
  import { narrative } from "./narrative"
  import { clearTerminalOutput } from "../Terminal/functions/helpers"
  import { playerCore } from "../../modules/state"

  const dispatch = createEventDispatcher()

  import Terminal from "../Terminal/Terminal.svelte"

  let terminalComponent: any
  let narrativeIndex = 0

  const handleCommand = async (e: any) => {
    if (e.detail.command.id === COMMAND.SKIP) {
      clearTerminalOutput()
      dispatch("done")
    }
    if (e.detail.command.id === COMMAND.BLINK) {
      // Move the story forward
      narrativeIndex++
      // Write the next part of the story to the terminal
      if (narrativeIndex < narrative.length) {
        await narrative[narrativeIndex]()
      }
      // End of narrative reached
      if (narrativeIndex === narrative.length - 1) {
        clearTerminalOutput()
        dispatch("done")
      }
    }

    terminalComponent.resetInput()
  }

  onMount(async () => {
    // Skip intro if player is already spawned
    if ($playerCore && $playerCore.carriedBy) {
      await typeWriteToTerminal(
        OutputType.SPECIAL,
        "Welcome back...",
        SYMBOLS[7],
        10,
        1000
      )
      clearTerminalOutput()
      dispatch("done")
    } else {
      await narrative[0]()
      terminalComponent.resetInput()
    }
  })
</script>

<div class="spawn">
  <Terminal
    bind:this={terminalComponent}
    terminalType={TerminalType.SPAWN}
    placeholder="BLINK"
    on:commandExecuted={e => handleCommand(e)}
  />
</div>

<style>
  .spawn {
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
