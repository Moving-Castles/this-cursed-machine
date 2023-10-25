<script lang="ts">
  // import { playerCore } from "../../modules/state"
  // import { staticContent } from "../../modules/content"
  // import { playSound } from "../../modules/sound"
  // import { spawn } from "../../modules/action"
  import { COMMAND, TerminalType } from "../Terminal/types"
  import { narrative } from "./narrative"

  import Terminal from "../Terminal/Terminal.svelte"

  let terminalComponent: any
  let narrativeIndex = 0

  // async function sendSpawn() {
  //   playSound("tcm", "alarm")
  //   await spawn()
  // }

  const handleCommand = async (e: any) => {
    if (e.detail.command.id === COMMAND.BLINK) {
      // Move the story forward
      narrativeIndex++
      // Write the next part of the story to the terminal
      if (narrativeIndex < narrative.length) {
        await narrative[narrativeIndex]()
      }
    }
    terminalComponent.resetInput()
  }
</script>

<div class="spawn">
  <Terminal
    bind:this={terminalComponent}
    terminalInit={narrative[0]}
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
