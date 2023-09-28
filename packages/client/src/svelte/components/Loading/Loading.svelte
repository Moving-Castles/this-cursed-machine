<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { staticContent } from "../../modules/content"
  import { animateContent } from "./typewriter"

  let called = false
  const dispatch = createEventDispatcher()

  const next = () => dispatch("next")

  // Run intro sequence when content is loaded
  $: if ($staticContent.loading) {
    runIntroSequence()
  }

  async function runIntroSequence() {
    if (called) return
    called = true
    await animateContent($staticContent.loading.content.content, 2, 300)
    await new Promise(res => setTimeout(res, 300))
    next()
  }
</script>

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
