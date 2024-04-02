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
    <img src="/images/bugsy.gif" alt="bugsy" />
  </div> -->
  <div class="text">
    {msg.message}
  </div>
  <button on:click={sendStart}> Start </button>
</div>

<style lang="scss">
  .msg {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    padding-top: 0;
    text-align: center;
    background: var(--foreground);
    margin-top: 10px;
    overflow: hidden;
    white-space: pre-wrap;
    text-align: left;
    font-size: 22px;
    font-size: var(--font-size);
    line-height: 1em;
    color: var(--background);
    text-align: center;

    border: 5px solid var(--color-alert);
    padding: 20px;

    img {
      width: 90px;
      margin: 10px auto;
      margin-left: auto;
      margin-right: auto;
    }

    .image {
      padding: 20px;
    }
  }
</style>
