<script lang="ts">
  import { playerCore } from "../../modules/state"
  import { playSound } from "../../modules/sound"
  import { spawn } from "../../modules/action"
  import { staticContent } from "../../modules/content"
  import { renderBlockText } from "../../modules/content/sanity"
  let spawnInProgress = false
  let showSpawn = false

  let i = 0

  function sendSpawn() {
    if (spawnInProgress) return
    spawnInProgress = true
    playSound("tekken", "click")
    spawn()
  }

  const next = () => {
    if (i < $staticContent.spawning.content.content.length - 1) {
      i++
    } else {
      showSpawn = true
    }
  }
</script>

<div class="spawn">
  {#if !$playerCore}
    <div class="placeholder">
      {#if $staticContent.spawning && $staticContent.spawning.content && !showSpawn}
        {#key i}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="block" on:click={next}>
            {@html renderBlockText($staticContent.spawning.content.content[i])}
          </div>
        {/key}
      {:else}
        <button on:click={sendSpawn} disabled={spawnInProgress}>Spawn</button>
      {/if}
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
    cursor: pointer;
    background: black;
    color: white;
    border: 4px solid white;

    &:hover {
      background: white;
      color: black;
    }
  }

  .placeholder {
    max-width: 40ch;
    text-align: center;
    padding: 20px;
    margin: 0 auto;
    cursor: pointer;
  }

  :global(p.normal) {
    margin-bottom: 1rem;
  }
</style>
