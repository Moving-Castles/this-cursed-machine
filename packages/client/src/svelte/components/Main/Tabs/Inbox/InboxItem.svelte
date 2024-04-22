<script lang="ts">
  import { fade } from "svelte/transition"
  import { urlFor } from "@modules/content/sanity"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"
  import type { InboxMessage } from "./types"

  export let message: InboxMessage

  let open = false

  function toggleMessage() {
    open = !open
    advanceTutorial(null, $tutorialProgress, "read")
  }
</script>

<div class="message">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    on:click={toggleMessage}
    class="listing"
    class:open
    class:pulse={$tutorialProgress === 19}
  >
    <div class="indicator" />
    <div class="sender">Sender</div>
    <div class="title">{message.title}</div>
    <div class="time">{message._updatedAt}</div>
  </div>

  {#if open}
    <div class="content" in:fade>
      <img
        crossorigin="anonymous"
        src={urlFor(message.attachment).url()}
        alt={message.title}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  .message {
    .listing {
      width: 100%;
      color: var(--foreground);
      padding: var(--default-padding);
      border-bottom: 1px solid var(--color-grey-light);
      display: flex;
      align-items: center;
      user-select: none;

      .indicator {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: var(--color-success);
        margin-right: 20px;
        animation: 0.7s linear 0s infinite alternate pulse;
      }

      @keyframes pulse {
        0% {
          opacity: 0.1;
        }
        100% {
          opacity: 1;
        }
      }

      .sender {
        width: 10ch;
        margin-right: 40px;
        color: var(--color-grey-light);
      }

      .title {
        flex: 1;
      }

      .time {
        color: var(--color-grey-light);
        font-size: var(--font-size-small);
      }

      &:hover {
        background: var(--foreground);
        color: var(--color-grey-dark);
        cursor: pointer;

        .sender {
          color: var(--color-grey-dark);
        }

        .time {
          color: var(--color-grey-dark);
        }
      }

      &.open {
        background: var(--foreground);
        color: var(--color-grey-dark);
        cursor: pointer;

        .sender {
          color: var(--color-grey-dark);
        }

        .time {
          color: var(--color-grey-dark);
        }
      }
    }

    .content {
      margin: 1rem 0;
      inset: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 1rem;
      }
    }
  }
</style>
