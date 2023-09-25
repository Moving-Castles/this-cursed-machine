<script lang="ts">
  import { toastMessage } from "../../modules/ui/toast"
  import { playerCore, machines } from "../../modules/state"
  import { playSound } from "../../modules/sound"
  import { spawn } from "../../modules/action"
  import Terminal from "../Terminal/Terminal.svelte"

  // import Ellipse from "../Game/Ellipse.svelte"

  let name = ""

  let spawnInProgress = false

  // function sendSpawn() {
  //   if (spawnInProgress) return
  //   if (name.length < 5) {
  //     playSound("tekken", "error")
  //     toastMessage("Name must be at least 5 characters long")
  //     return
  //   }
  //   spawnInProgress = true
  //   playSound("tekken", "click")
  //   console.log(name.toUpperCase())
  //   spawn()
  // }

  // const onSend = e => {
  //   name = e.detail
  //   sendSpawn()
  // }

  const onDone = e => {
    if (spawnInProgress) return
    spawnInProgress = true
    spawn()
  }
</script>

<div class="spawn">
  {#if !$playerCore}
    <Terminal
      stage
      input
      theme="transparent"
      placeholder="Blink"
      on:done={onDone}
    />
  {/if}
</div>

<style>
  .spawn {
    position: fixed;
    inset: 0;
    background-color: black;
    background-size: cover;
    background-position: center;
    z-index: 1;
  }
</style>
