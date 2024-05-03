<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte"
  import { slide } from "svelte/transition"
  import { urlFor } from "@modules/content/sanity"
  import { tutorialProgress, advanceTutorial } from "@modules/ui/assistant"
  import { stepsEasing } from "@modules/utils"
  import type { InboxMessage } from "./types"

  const dispatch = createEventDispatcher()

  export let message: InboxMessage
  export let selected = false
  export let open = false

  let interval: ReturnType<typeof setInterval>
  let speed = 100
  let chars = 14

  let scroll: HTMLDivElement
  let i = 0
  let clippedSender = message?.sender.slice(i, i + chars).padEnd(chars, " ")

  $: if (open) {
    dispatch("open")
    advanceTutorial(null, $tutorialProgress, "read")
    scroll?.focus()
  }
  $: {
    if ((selected || open) && message.sender.length > chars) {
      clippedSender = message.sender.slice(i, i + chars)
    }
  }
  $: if (!selected && !open) i = 0

  const scrollContent = e => {
    if (e.key === "ArrowDown") {
      scroll.scrollTop += chars
    } else if (e.key === "ArrowUp") {
      scroll.scrollTop -= chars
    }
    if (e.key === "Escape") {
      dispatch("close")
      if (message.sender.length > chars) {
        clippedSender = message.sender.slice(i, i + chars)
      }
      i = 0
    }
  }

  onMount(() => {
    interval = setInterval(() => {
      i = (i + 1) % message.sender.length
    }, speed)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click tabindex="-1" class="message">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    tabindex="-1"
    class="listing"
    class:selected
    class:open
    class:emphasis={$tutorialProgress === 27}
  >
    <div class="indicator" />
    <div class="sender">{clippedSender}</div>
    <div class="title">{message.title}</div>
    <div class="time">{message._updatedAt}</div>
  </div>

  {#if open}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      bind:this={scroll}
      on:keydown={scrollContent}
      class="content"
      tabindex="-1"
      transition:slide={{ duration: 100, easing: stepsEasing }}
    >
      <div class="content-track">
        {#if message.description}
          <p class="message-body">
            {message.description}
          </p>
        {/if}
        {#each message.attachments as attachment}
          <figure>
            <img
              src={urlFor(attachment.image).url()}
              alt={attachment.image.filename}
            />
            {#if attachment.filename}
              <figcaption>{attachment.filename}</figcaption>
            {/if}
          </figure>
        {/each}

        <div class="comms-disclaimer">
          All content Courtesy of TCM Corp. Any communication relayed to stumps
          shall not be forwarded to other stumps. <em
            >Any stumps caught with TCM content will be prosecuted</em
          >
        </div>
      </div>
    </div>
    <div class="shadow" />
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
      white-space: nowrap;

      .indicator {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: var(--color-success);
        margin-right: 20px;
        animation: 0.7s steps(5) 0s infinite alternate pulse;
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
        width: 14ch;
        margin-right: 40px;
        color: var(--color-grey-light);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .time {
        color: var(--color-grey-light);
        font-size: var(--font-size-small);
      }

      &.selected,
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
    .shadow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: var(--z-1);
      display: block;
      width: 100%;
      height: 3rem;
      pointer-events: none;
      // background: red;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    }

    .content {
      margin: 1rem 0;
      padding: 1rem 1rem 3rem;
      inset: 0;
      height: calc(100vh - 260px);
      overflow-y: scroll;
      scroll-behavior: auto;
      border-bottom: 2px dashed var(--white);
      position: relative;

      .message-body {
        padding: 1rem 1rem 3rem;
      }

      figure {
        width: 100%;

        img {
          width: 100%;
          object-fit: contain;
        }
        margin: 1rem 0 3rem;

        figcaption {
          padding: 1rem 0;
        }
      }
    }

    .comms-disclaimer {
      width: 100%;
      color: var(--color-failure);
      font-size: var(--font-size-small);
      text-align: center;
      margin-bottom: 3rem;
      padding: 0 1rem;
      line-height: 1.2em;

      em {
        font-style: normal;
        background: var(--color-failure);
        color: var(--black);
      }
    }
  }
</style>
