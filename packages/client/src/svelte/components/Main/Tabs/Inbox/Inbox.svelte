<script lang="ts">
  import { staticContent } from "@modules/content"
  import { player } from "@modules/state/base/stores"
  import { fade } from "svelte/transition"
  import { urlFor } from "@modules/content/sanity"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"

  let viewing = -1

  $: messages = $staticContent.messages.filter(
    msg => {
      if ($player.tutorial) {
        return $player.tutorial && msg.tutorial
      } else {
        return msg
      }
    },
    // msg => msg
  )

  const open = (i: number) => {
    viewing = viewing === i ? -1 : i
    advanceTutorial(null, $tutorialProgress, "read")
  }
</script>

<div class="inbox" in:fade>
  {#each messages as message, i}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={() => open(i)} class="message">
      <button class="opener" class:pulse={$tutorialProgress === 19}>
        {message.title}
      </button>

      {#if viewing === i && messages?.[i]?.attachment}
        <div class="attachment">
          <!-- {#if import.meta.env.PROD} -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <img
            on:click={() => (i = -1)}
            src={urlFor(messages?.[i]?.attachment).url()}
            alt={message.title}
          />
        </div>
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  .inbox {
    padding: 20px;
  }

  .opener {
    width: 100%;
    height: 10rem;
    vertical-align: middle;
    font-family: var(--font-family);
    background: var(--foreground);
    color: var(--background);
    border: none;
  }

  .opener:hover {
    background: var(--background);
    color: var(--foreground);
  }

  .attachment {
    margin: 1rem 0;
  }
</style>
