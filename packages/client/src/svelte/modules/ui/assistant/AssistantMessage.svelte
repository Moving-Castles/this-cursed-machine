<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import type { AssistantMessage } from "."
  import { createEventDispatcher } from "svelte"
  import { playSound } from "@modules/sound"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"
  import { start } from "@modules/action"

  const dispatch = createEventDispatcher<{ end: AssistantMessage }>()

  export let msg: AssistantMessage

  let working = false
  let confirming = false

  let timeout: ReturnType<typeof setTimeout>

  const startConfirm = () => {
    confirming = true
  }

  async function sendStart() {
    working = true
    confirming = false
    playSound("tcm", "listPrint")
    const action = start()
    await waitForCompletion(action)
    playSound("tcm", "TRX_yes")
    working = false
    tutorialProgress.set(0)
    clearTerminalOutput()
  }

  const close = () => dispatch("end", msg)

  onMount(() => {
    if (msg.disappear) {
      timeout = setTimeout(close, 10000)
    }
  })

  onDestroy(() => {
    clearTimeout(timeout)
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="msg absolute">
  <!-- <div class="image">
    <img src="/images/eye3.gif" alt="bot" />
  </div> -->
  <div class="text">
    {msg.message}
  </div>
  <div class="restart">
    {#if !confirming}
      <button on:click={startConfirm}>Start over</button>
    {:else}
      <button on:click={sendStart}>I want to restart</button>
      <button on:click={() => (confirming = false)}>x</button>
    {/if}
  </div>
</div>

<style lang="scss">
  .msg {
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 0;
    text-align: center;
    background: var(--background);
    margin-top: 10px;
    overflow: hidden;
    white-space: pre-wrap;
    text-align: left;
    font-size: 22px;
    font-size: var(--font-size);
    line-height: 1em;
    color: var(--foreground);
    text-align: center;
    border: 5px double var(--color-success);
    color: var(--color-success);
    position: relative;
    user-select: none;

    .image {
      line-height: 0;
      padding: 20px;
      img {
        width: 100px;
        margin-left: auto;
        margin-right: auto;
        // border-radius: 50%;
      }
    }

    &:hover {
      .restart {
        display: block;
      }
    }

    .restart {
      position: absolute;
      top: 0;
      right: 0;
      display: none;

      button {
        background: var(--color-grey-dark);
        color: var(--foreground);
        padding: 7px;
        border: none;
        cursor: pointer;
        font-size: var(--font-size-small);
        font-family: var(--font-family);

        &:hover {
          background: var(--foreground);
          color: var(--background);
        }
      }
    }

    .text {
      padding: 40px;
      // padding-left: 0;
      width: 100%;
    }
  }
</style>
