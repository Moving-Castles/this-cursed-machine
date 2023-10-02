<script lang="ts">
  // import { toastMessage } from "../../modules/ui/toast"
  import { playerCore, machines } from "../../modules/state"
  import { playSound } from "../../modules/sound"
  import { spawn } from "../../modules/action"
  import Terminal from "../Terminal/Terminal.svelte"
  import Frame from "../Frame/Frame.svelte"

  // import Ellipse from "../Game/Ellipse.svelte"

  let spawnInProgress = false

  function sendSpawn() {
    if (spawnInProgress) return
    spawnInProgress = true
    playSound("tekken", "click")
    spawn()
  }

  // const onSend = e => {
  //   sendSpawn()
  // }

  // const onDone = e => {
  //   if (spawnInProgress) return
  //   spawnInProgress = true
  //   spawn()
  // }
</script>

<div class="spawn">
  <div class="split-screen">
    {#if !$playerCore}
      <button on:click={sendSpawn}>Spawn</button>
      <!-- <Terminal
        input
        theme="transparent"
        placeholder="Blink"
        on:done={onDone}
      /> -->
    {/if}
    <div class="right-col">
      <Frame name="intro" />
    </div>
  </div>
</div>

<style>
  .split-screen {
    align-items: center;
    justify-items: center;
  }
  .spawn {
    position: fixed;
    inset: 0;
    background-color: black;
    background-size: cover;
    background-position: center;
    z-index: 1;
  }

  .right-col {
    /* grid-column: 1 / span 2; */
  }
</style>
