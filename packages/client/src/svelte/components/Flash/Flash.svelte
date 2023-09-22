<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"

  const dispatch = createEventDispatcher()

  const next = () => dispatch("next")

  onMount(() => {
    setTimeout(() => {
      next()
    }, 500)
  })
</script>

<div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="flash" on:click={next}>
    <div class="flash-content">
      <img src="./troll.jpg" alt="troll" />
    </div>
  </div>
</div>

<style lang="scss">
  .flash {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-family: var(--font-family);
    background: var(--white);
    font-size: var(--font-size-normal);
    color: inherit;
    user-select: none;
    cursor: pointer;
    animation: blinkingBackground 0.05s infinite;
    display: flex;
    justify-content: center;
    align-items: center;

    .flash-content {
      width: 100%;
      height: 100%;
      mix-blend-mode: exclusion;
      animation: blinkingOpacity 1s infinite;
      opacity: 1;
      transform: scale(0.5);
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  @keyframes blinkingBackground {
    50% {
      background-color: var(--black);
    }
  }

  @keyframes blinkingOpacity {
    50% {
      transform: scale(1.5);
    }
  }
</style>
