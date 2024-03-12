<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import {
    COMMAND,
    TERMINAL_OUTPUT_TYPE,
    TERMINAL_TYPE,
  } from "@components/Main/Terminal/enums"
  import { SYMBOLS } from "@components/Main/Terminal"
  import { typeWriteToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
  import { narrative } from "@components/Spawn/narrative"
  import { player } from "@modules/state/base/stores"

  const dispatch = createEventDispatcher()

  import Terminal from "@components/Main/Terminal/Terminal.svelte"

  let terminalComponent: any
  let narrativeIndex = 0

  const handleCommand = async (e: any) => {
    if (e.detail.command.id === COMMAND.SKIP) {
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
        dispatch("done")
      }
    }

    terminalComponent.resetInput()
  }

  onMount(async () => {
    // Skip intro if player is completed or spawned
    // if ($player && $player.level > Object.keys($levels).length) {
    //   await typeWriteToTerminal(
    //     TERMINAL_OUTPUT_TYPE.SPECIAL,
    //     `Welcome back ${$player.name ? $player.name : "stump"}...`,
    //     SYMBOLS[7],
    //     10,
    //     1000,
    //   )
    //   dispatch("completed")
    // } else
    if ($player?.carriedBy) {
      await typeWriteToTerminal(
        TERMINAL_OUTPUT_TYPE.SPECIAL,
        "Welcome back...",
        SYMBOLS[7],
        10,
        1000,
      )
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
    terminalType={TERMINAL_TYPE.SPAWN}
    placeholder="BLINK"
    setBlink
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
