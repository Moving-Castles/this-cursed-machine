<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import type { AssistantMessage } from "."
  import { createEventDispatcher } from "svelte"
  import { playSound } from "@modules/sound"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { start } from "@modules/action"

  const dispatch = createEventDispatcher<{ end: AssistantMessage }>()

  export let msg: AssistantMessage

  let working = false

  let timeout: ReturnType<typeof setTimeout>

  async function sendStart() {
    working = true
    playSound("tcm", "listPrint")
    const action = start()
    await waitForCompletion(action)
    playSound("tcm", "TRX_yes")
    working = false
    tutorialProgress.set(0)
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
    <button on:click={sendStart}>Start over</button>
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

    .restart {
      position: absolute;
      top: 0;
      right: 0;

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
