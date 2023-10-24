<script lang="ts">
  import { playSound } from "../../modules/sound"
  import { transfer } from "../../modules/action"
  let inProgress = false

  function sendTransfer() {
    if (inProgress) return
    inProgress = true
    playSound("tcm", "solidTile01")
    transfer()
  }
</script>

<div class="intro">
  <div class="placeholder">
    <button on:click={sendTransfer} disabled={inProgress}>Enter Pod</button>
  </div>
</div>

<style>
  .intro {
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
