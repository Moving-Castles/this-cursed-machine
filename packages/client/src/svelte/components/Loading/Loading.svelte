<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { ready, loadingMessage } from "../../modules/network"
  import { playerCore } from "../../modules/state"
  import { lore } from "../../modules/content/lore"

  const dispatch = createEventDispatcher()

  const next = () => dispatch("next")

  $: if ($playerCore && $ready) next()
</script>

<div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="loading" class:story={$ready} on:click={next}>
    <div class="loading-message" class:story-inner={$ready}>
      {#if !$ready}
        {$loadingMessage}
      {:else}
        <img src="/GM.png" alt={lore.title} class="gm headshake" />
        <!-- {lore.title} -->
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    font-size: 12px;

    &.story {
      background: #000;
      font-size: 8vw;
      color: blue;
      user-select: none;
      cursor: pointer;
    }

    .story-inner {
      background: #000;
      color: blue;
      max-width: 80%;
      margin-left: auto;
      margin-right: auto;
      font-family: var(--font-family-special);
    }

    .gm {
      position: fixed;
      left: 50%;
      top: 50%;
      filter: contrast(2);
    }
    .headshake {
      animation: 10s infinite linear headshake;
    }
  }

  @keyframes headshake {
    0% {
      transform: translate(-50%, -50%) translateX(0);
    }

    6.5% {
      transform: translate(-50%, -50%) translateX(-6px) rotateY(-9deg);
    }

    18.1% {
      transform: translate(-50%, -50%) translateX(5px) rotateY(7deg);
      filter: contrast(2) invert(0);
    }
    18.7% {
      transform: translate(-50%, -50%) skew(80deg, 80deg) scale(-5)
        translateX(5px) rotateY(7deg);
      filter: contrast(2) invert(1);
    }
    19.8% {
      transform: translate(-50%, -50%) translateX(5px) rotateY(7deg);
      filter: contrast(2) invert(0);
    }

    31.5% {
      transform: translate(-50%, -50%) translateX(-3px) rotateY(-5deg);
    }

    43.5% {
      transform: translate(-50%, -50%) translateX(2px) rotateY(3deg);
    }

    50% {
      transform: translate(-50%, -50%) translateX(0);
    }
    100% {
      transform: translate(-50%, -50%);
    }
  }
</style>
