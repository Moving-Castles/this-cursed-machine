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
        {lore.title}
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
  }
</style>
