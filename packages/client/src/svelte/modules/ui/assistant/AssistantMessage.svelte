<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import type { AssistantMessage } from "."
  import { createEventDispatcher } from "svelte"
  import { playSound } from "@modules/sound"
  import { activeTab } from "@modules/ui/stores"
  import {
    tutorialProgress,
    advanceConditions,
    tutorialCompleted,
  } from "@modules/ui/assistant"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"
  import { start } from "@modules/action"
  import { materialMetadata, player } from "@modules/state/base/stores"
  import { playerOrder } from "@modules/state/simulated/stores"

  const dispatch = createEventDispatcher<{ end: AssistantMessage }>()

  export let msg: AssistantMessage

  const parse = (str: string) => {
    if (!$player) return str

    str = str.replaceAll("%PLAYER%", $player.name)
    str = str.replaceAll("%NAME%", $player.name)

    if ($playerOrder) {
      str = str.replaceAll(
        "%MATERIAL%",
        $materialMetadata[$playerOrder?.order?.materialId]?.name,
      )
    }

    const condition = $advanceConditions[$tutorialProgress]

    if (!condition) return str

    if (condition.type === "command") {
      condition.value.forEach(cmd => {
        if (cmd !== ".")
          str = str
            .toLowerCase()
            .replaceAll(cmd, `<span class="command">${cmd}</span>`)
      })
    }
    if (condition.type === "contract") {
      const reverseMappings = {
        shipTank: "ship",
        plugTank: "plug",
        connect: "connect",
        buyOffer: "fill",
        buildMachine: "build",
        build: "build",
      }

      const cmd = reverseMappings[condition.value.systemId]

      if (!cmd) return str
      str = str
        .toLowerCase()
        .replaceAll(cmd, `<span class="command">${cmd}</span>`)
    }

    return str
  }

  $: message = parse(msg?.message)

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
    tutorialCompleted.set([])
    $activeTab = 0
    clearTerminalOutput()
  }

  const close = () => dispatch("end", msg)

  onMount(() => {
    playSound("tcm", "asisstantHit")
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
    {@html message}
  </div>
  {#if !working}
    <div class="restart">
      {#if !confirming}
        <button on:click={startConfirm}>Restart employee training</button>
      {:else}
        <button on:click={sendStart}>I want to restart</button>
        <button on:click={() => (confirming = false)}>x</button>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .msg {
    width: 100%;
    display: flex;
    align-items: center;
    padding-top: 0;
    background: var(--background);
    margin-top: 10px;
    overflow: hidden;
    white-space: pre-line;
    text-align: left;
    font-size: 22px;
    font-size: var(--font-size);
    line-height: 1.2em;
    color: var(--foreground);
    text-align: left;
    border: 2px dashed var(--color-tutorial);
    color: var(--color-tutorial);
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
      text-align-last: left;
      padding: 20px 40px;
      // padding-left: 0;
      width: 100%;
    }
  }
</style>
