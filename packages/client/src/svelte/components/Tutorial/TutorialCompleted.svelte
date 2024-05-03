<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { player } from "@modules/state/base/stores"
  import {
    COMMAND,
    TERMINAL_OUTPUT_TYPE,
    TERMINAL_TYPE,
  } from "@components/Main/Terminal/enums"
  import { currentMessage, tutorialProgress } from "@modules/ui/assistant"
  import { typeWriteToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
  import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"

  import Terminal from "@components/Main/Terminal/Terminal.svelte"

  const dispatch = createEventDispatcher()

  let terminalComponent: any

  const handleCommand = async (e: any) => {
    if (e.detail.command.id === COMMAND.SKIP) {
      dispatch("done")
    }
    if (e.detail.command.id === COMMAND.BLINK) {
      $tutorialProgress++
      clearTerminalOutput()
    }

    if (terminalComponent) {
      terminalComponent.resetInput()
    }
  }

  onMount(async () => {
    const messages = $currentMessage.explanation
      .split("\n")
      .map(msg => msg.replaceAll("%PLAYER%", $player.name))
      .filter(msg => msg !== "")

    let i = 0
    for (const message of messages) {
      await typeWriteToTerminal(
        i === 0 ? TERMINAL_OUTPUT_TYPE.SUCCESS : TERMINAL_OUTPUT_TYPE.NORMAL,
        message,
      )
      i++
    }
  })
</script>

<div class="completed">
  <Terminal
    bind:this={terminalComponent}
    terminalType={TERMINAL_TYPE.completed}
    placeholder="BLINK"
    setBlink
    skipBootMessage
    on:commandExecuted={e => handleCommand(e)}
  />
</div>

<style>
  .completed {
    position: fixed;
    inset: 0;
    background-color: var(--background);
    background-size: cover;
    background-position: center;
    z-index: var(--z-1);
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
