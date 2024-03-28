<script lang="ts">
  import { staticContent } from "@modules/content"
  import { player } from "@modules/state/base/stores"
  import { fade } from "svelte/transition"
  import { urlFor } from "@modules/content/sanity"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"

  let viewing = -1

  $: messages = $staticContent.messages.filter(
    msg => $player.tutorial && msg.tutorial
    // msg => msg
  )

  const open = i => {
    viewing = viewing === i ? -1 : i
    console.log("opening")
    advanceTutorial(null, $tutorialProgress, "read")
  }
</script>

<div class="inbox" in:fade>
  {#each messages as message, i}
    <div on:click={() => open(i)} class="message">
      <button class="opener">
        {message.title}
      </button>

      {#if viewing === i && messages?.[i]?.attachment}
        <div class="attachment">
          {#if import.meta.env.PROD}
            <img
              on:click={() => (i = -1)}
              src={urlFor(messages?.[i]?.attachment)}
              alt={message.title}
            />
          {/if}
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
    background: var(--alt-foreground);
    color: var(--black);
    border: none;
  }

  .opener:hover {
    background: var(--black);
    color: var(--alt-foreground);
  }

  .attachment {
    margin: 1rem 0;
  }
</style>
