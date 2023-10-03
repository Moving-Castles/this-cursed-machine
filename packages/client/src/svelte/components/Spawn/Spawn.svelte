<script lang="ts">
  import { playerCore } from "../../modules/state"
  import { playSound } from "../../modules/sound"
  import { spawn } from "../../modules/action"
  import { staticContent } from "../../modules/content"
  import { renderBlockText } from "../../modules/content/sanity"
  let spawnInProgress = false

  function sendSpawn() {
    if (spawnInProgress) return
    spawnInProgress = true
    playSound("tekken", "click")
    spawn()
  }
</script>

<div class="spawn">
  {#if !$playerCore}
    <div class="placeholder">
      {#if $staticContent.spawning && $staticContent.spawning.content}
        {@html renderBlockText($staticContent.spawning.content.content)}
      {/if}
      <button on:click={sendSpawn} disabled={spawnInProgress}>Spawn</button>
    </div>
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
    display: flex;
    align-items: center;
    justify-items: center;
  }

  button {
    padding: 20px;
    font-size: var(--font-size-normal);
    font-family: var(--font-family);
    margin-top: 1em;
  }

  .placeholder {
    max-width: 80%;
    text-align: center;
    padding: 20px;
  }
</style>
