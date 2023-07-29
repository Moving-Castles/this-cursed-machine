<script lang="ts">
  import { slide } from "svelte/transition"
  import { cores, playerEntityId } from "../../modules/state"
  import { verifiedClients } from "../../modules/signal"
  import { playSound } from "../../modules/sound"
  import gsap from "gsap"

  let expanded = false
  function togglePresence() {
    expanded = !expanded
    playSound("tekken", "select")
  }

  let toggleEl: HTMLElement
  function flash(color: string) {
    const tl = gsap.timeline()
    tl.to(toggleEl, { duration: 0, backgroundColor: color })
    tl.to(toggleEl, {
      duration: 0.8,
      backgroundColor: "rgba(211, 211, 211, 0.8)",
    })
  }

  let verifiedClientsCount = 0
  $: {
    if ($verifiedClients.length > verifiedClientsCount) {
      flash("rgba(0, 255, 0, 0.8)")
    } else if ($verifiedClients.length < verifiedClientsCount) {
      flash("rgba(255, 0, 0, 0.8)")
    }
    verifiedClientsCount = $verifiedClients.length
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="presence-toggle"
  bind:this={toggleEl}
  class:expanded
  on:click={togglePresence}
>
  {$verifiedClients.length}
</div>

{#if expanded}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="presence"
    transition:slide={{ duration: 200 }}
    on:click={togglePresence}
  >
    <strong>
      {$verifiedClients.length} core{$verifiedClients.length > 1 ? "s" : ""} online
    </strong>
    <hr />
    <ul>
      {#each $verifiedClients as key}
        <li>
          {$cores[key].name}
          {#if key === $playerEntityId}(YOU){/if}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style lang="scss">
  .presence-toggle {
    top: 10px;
    right: 10px;
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
    font-size: 18px;

    &.expanded {
      background: rgba(211, 211, 211, 1);
    }
  }

  .presence {
    top: 55px;
    right: 30px;
    position: fixed;
    z-index: 10000;
    color: black;
    background: rgba(211, 211, 211, 0.8);
    padding: 15px;
  }

  ul,
  li {
    list-style-position: inside;
    margin: 0;
    padding: 0;
  }
</style>
