<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { staticContent } from "../../modules/content"
  import { animateContent } from "./typewriter"

  const dispatch = createEventDispatcher()

  const next = () => dispatch("next")

  $: if ($staticContent.loading) {
    animateContent($staticContent.loading.content.content, 3, 300)
  }
</script>

<div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="loading" on:click={next}>
    <div id="root" class="loading-message" />
  </div>
</div>

<style lang="scss">
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: var(--white);
    font-family: var(--font-family);
    background: var(--black);
    font-size: var(--font-size-normal);
    color: inherit;
    user-select: none;
    cursor: pointer;

    .loading-message {
      width: 80%;
      max-width: 64ch;
      padding: 20px;
      height: 100%;
      overflow: scroll;
      padding-bottom: 20%;
    }
  }
</style>
