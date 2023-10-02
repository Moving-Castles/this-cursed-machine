<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { staticContent } from "../../modules/content"
  import { animateContent } from "./typewriter"

  const dispatch = createEventDispatcher()

  const next = () => dispatch("next")

  // Run intro sequence when content is loaded
  $: if ($staticContent.loading) {
    runIntroSequence()
  }

  async function runIntroSequence() {
    await animateContent($staticContent.loading.content.content, 1, 200)
    await new Promise(res => setTimeout(res, 200))
    next()
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={next}>
  <div class="loading">
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
