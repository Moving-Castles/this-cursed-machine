<script lang="ts">
  import { toastMessage } from "../../modules/ui/toast"
  import { onMount } from "svelte"
  import { playSound } from "../../modules/sound"
  import { spawn } from "../../modules/action"

  import Ellipse from "../Game/Ellipse.svelte"

  let inputEl: HTMLInputElement
  let name = ""
  let spawnInProgress = false
  function sendSpawn() {
    if (spawnInProgress) return
    if (name.length < 5) {
      playSound("tekken", "error")
      toastMessage("Name must be at least 5 characters long")
      return
    }
    spawnInProgress = true
    playSound("tekken", "click")
    spawn(name.toUpperCase())
  }

  onMount(() => {
    inputEl.focus()
  })
</script>

<div class="spawn">
  <div class="spawn-dialog">
    Who are you?<br />
    <input
      class="name-input"
      type="text"
      bind:this={inputEl}
      bind:value={name}
      on:keydown={e => {
        if (e.key === "Enter") {
          sendSpawn()
        }
      }}
    />
    <button on:click={sendSpawn}>
      {#if spawnInProgress}
        <Ellipse />
      {:else}
        SPAWN{/if}
    </button>
  </div>
</div>

<style lang="scss">
  .spawn {
    font-family: var(--font-family-special);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0000ff;
    font-size: 72px;
    color: black;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .spawn-dialog {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 900px;
  }

  .name-input {
    font-family: var(--font-family-special) !important;
    font-family: monospace;
    text-align: center;
    outline: none;
    border: none;
    font-size: 72px;
    background: white;
    color: black;
    margin: 0;
    width: 100%;
    text-transform: uppercase;
  }

  button {
    font-size: 32px;
    font-family: var(--font-family-special);
    margin-top: 40px;
    width: 50%;
    margin-left: 0;
    margin-right: 0;
    border: 1px solid black;
    background: blue;
    cursor: pointer;

    &:hover {
      background: white;
    }
  }
</style>
