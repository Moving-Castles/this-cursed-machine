<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { staticContent } from "@modules/content"
  import { animateContent, typeWriter } from "@components/Loading/typewriter"
  import { ready, loadingMessage } from "@modules/network"

  const dispatch = createEventDispatcher()

  let introDone = false
  let introStarted = false
  let loadingMessageElement: HTMLDivElement
  let loadingInterval: NodeJS.Timeout

  const done = () => dispatch("done")

  // Run intro sequence when content is loaded
  $: if ($staticContent.loading && loadingMessageElement && !introStarted) {
    runIntroSequence()
  }

  // Finished when intro is done and chain is ready
  $: if (introDone && $ready) {
    if (loadingInterval) clearInterval(loadingInterval)
    done()
  }

  async function runIntroSequence() {
    introStarted = true
    await animateContent(
      loadingMessageElement,
      $staticContent.loading.content.content,
      1,
      50,
    )
    await new Promise(res => setTimeout(res, 300))
    // Intro sequence done
    introDone = true
    // Return early if chain is already ready
    if ($ready) return
    // Otherwise wait for chain to load
    await typeWriter(loadingMessageElement, "Syncing network", 10)
    await new Promise(res => setTimeout(res, 300))
    loadingInterval = setInterval(() => {
      if (!loadingMessageElement) return
      loadingMessageElement.innerHTML += "  *"
      // Scroll to bottom
      loadingMessageElement.scrollTop = loadingMessageElement.scrollHeight
    }, 100)
  }

  const onClick = () => {
    if (import.meta.env && $ready) done()
  }
</script>

<div class="loading-percentage">{$loadingMessage}</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={onClick} class="loading">
  <div class="loading-message" bind:this={loadingMessageElement} />
</div>

<style lang="scss">
  .loading-percentage {
    position: fixed;
    top: 0;
    right: 0;
    height: 2em;
    width: 80px;
    background: var(--color-alert);
    color: var(--background);
    z-index: 10000;
    line-height: 2em;
    text-align: center;
    font-size: var(--font-size-small);
  }

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: var(--foreground);
    font-family: var(--font-family);
    background: var(--background);
    font-size: var(--font-size-normal);
    color: inherit;
    user-select: none;

    .loading-message {
      width: 80%;
      max-width: 64ch;
      padding: 20px;
      height: 100%;
      overflow-y: scroll;
      padding-bottom: 20%;
      text-wrap: wrap;
      word-break: break-all;
      line-height: 1.2em;
    }
  }
</style>
