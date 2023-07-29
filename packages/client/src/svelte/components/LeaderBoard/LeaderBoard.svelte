<script lang="ts">
  import { slide } from "svelte/transition"
  import { cores, playerEntityId } from "../../modules/state"
  import { playSound } from "../../modules/sound"

  let expanded = false

  function toggleLeaderboard() {
    expanded = !expanded
    playSound("tekken", "select")
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="leaderboard-toggle" class:expanded on:click={toggleLeaderboard}>
  ✦
</div>

{#if expanded}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="leaderboard"
    transition:slide={{ duration: 200 }}
    on:click={toggleLeaderboard}
  >
    <strong>Cores</strong>
    <hr />
    <ol>
      {#each Object.entries($cores) as [key, core]}
        <li>
          {core.name}
          {#if key === $playerEntityId}(YOU){/if}
          {core.energy}
        </li>
      {/each}
    </ol>
  </div>
{/if}

<style lang="scss">
  .leaderboard-toggle {
    top: 10px;
    left: 10px;
    position: fixed;
    z-index: 10000;
    color: black;
    background: rgba(211, 211, 211, 0.8);
    border-radius: 50%;
    height: 40px;
    width: 40px;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    font-size: 38px;

    &.expanded {
      background: rgba(211, 211, 211, 1);
    }
  }

  .leaderboard {
    top: 55px;
    left: 30px;
    position: fixed;
    z-index: 10000;
    color: black;
    background: rgba(211, 211, 211, 0.8);
    padding: 15px;
  }

  ol,
  li {
    list-style-position: inside;
    margin: 0;
    padding: 0;
  }
</style>
