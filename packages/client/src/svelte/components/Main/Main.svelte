<script lang="ts">
  import { onMount } from "svelte"
  import { player } from "@modules/state/base/stores"
  import { playSound } from "@modules/sound"

  import Terminal from "@components/Main/Terminal/Terminal.svelte"
  import InfoBar from "@components/Main/Bars/InfoBar.svelte"
  import TabBar from "@components/Main/Bars/TabBar.svelte"
  import OrderBar from "@components/Main/Bars/OrderBar.svelte"
  import Attachments from "@components/Main/Tabs/Pod/Attachments/Attachments.svelte"

  import { TABS } from "@modules/ui/enums"
  import { flicker } from "@modules/ui/transitions"
  import { activeTab } from "@modules/ui/stores"
  import { tutorialProgress } from "@modules/ui/assistant"

  import Pod from "@components/Main/Tabs/Pod/Pod.svelte"
  import Orders from "@components/Main/Tabs/Orders/Orders.svelte"
  import Inbox from "@components/Main/Tabs/Inbox/Inbox.svelte"
  import Chat from "@components/Main/Tabs/Chat/Chat.svelte"
  // import Debug from "@components/Main/Atoms/Debug.svelte"

  let resized = 0

  const tabList = {
    [TABS.POD]: {
      label: "Pod",
      component: Pod,
      enabled: true,
    },
    [TABS.ORDERS]: {
      label: "Orders",
      component: Orders,
      enabled: true,
    },
    [TABS.INBOX]: {
      label: "Inbox",
      component: Inbox,
      enabled: true,
    },
    [TABS.CHAT]: {
      label: "STUMPHUB",
      component: Chat,
      enabled: true,
    },
  }

  type ComponentType =
    | null
    | typeof Pod
    | typeof Inbox
    | typeof Orders
    | typeof Chat

  let currentTabComponent: ComponentType = null

  // Reactive statement to update CurrentComponent based on the activeTab value
  $: {
    currentTabComponent = tabList[$activeTab]?.component || null
  }

  let terminalComponent: any

  const handleCommand = async () => {
    terminalComponent?.resetInput()
  }

  $: {
    if ($tutorialProgress === 1) playSound("tcm", "mapPop")
  }

  // $: {
  //   if ($tutorialProgress == FINAL_TUTORIAL_LEVEL) {
  //     clearMessage()
  //     sendMessage(
  //       "You're with your kind now. I will come back when we have more work for you. Don't go anywhere",
  //       { disappear: true },
  //     )
  //   }
  // }

  onMount(() => {
    playSound("tcm", "podBg", true, false)
  })
</script>

{#if $player?.carriedBy}
  <div class="dust" />

  <!-- <Debug/> -->

  <div class="split-screen">
    <div class="left-col">
      <div class="info-bar">
        {#if $tutorialProgress > 5}
          <InfoBar />
        {/if}
      </div>
      <div class="terminal">
        {#if $tutorialProgress > 0}
          <Terminal
            bind:this={terminalComponent}
            on:commandExecuted={() => handleCommand()}
            setBlink
            placeholder={$tutorialProgress === 1 ? "BLINK" : "HELP"}
          />
        {/if}
      </div>
    </div>
    {#if $player}
      <div class="right-col">
        <div class="order-bar">
          {#if $tutorialProgress > 3}
            <OrderBar />
          {/if}
        </div>
        {#key $activeTab}
          <div class="tab-container">
            {#if $tutorialProgress === 0}
              <div class="dim" out:flicker={{ duration: 500 }} />
            {/if}
            {#if $tutorialProgress > 1}
              <!-- Render the CurrentComponent if it's not null -->
              {#if currentTabComponent}
                <svelte:component
                  this={currentTabComponent}
                  on:resize={() => resized++}
                />
              {/if}
            {/if}

            {#if $tutorialProgress > 2}
              {#key resized}
                <Attachments />
              {/key}
            {/if}
          </div>
        {/key}
        <div class="tab-bar">
          {#if $tutorialProgress > 1}
            <TabBar {tabList} />
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .dust {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--z-10);
    pointer-events: none;
    background-image: url(/images/dust.png);
    opacity: 0.6;
    background-size: cover;
    // mix-blend-mode: difference;
  }

  .dim {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: var(--z-9);
  }

  .split-screen {
    display: flex;
    height: 100vh;
    background-image: url(/images/tcm2.png);
    // background-image: url(/images/graf.png);
    background-size: 200px;
    background-repeat: repeat;

    .left-col {
      height: 100%;
      width: 500px;
      overflow: hidden;
      border-right: var(--default-border-style);

      .info-bar {
        height: var(--top-bar-height);
        border-bottom: var(--default-border-style);
        color: var(--foreground);
        font-size: var(--font-size-normal);
      }

      .terminal {
        height: calc(100vh - 40px);
        position: relative;
      }
    }

    .right-col {
      height: 100%;
      width: calc(100vw - 500px);
      overflow: hidden;
      position: relative;

      .order-bar {
        height: var(--top-bar-height);
        border-bottom: var(--default-border-style);
        font-size: var(--font-size-normal);
      }

      .tab-container {
        height: calc(100vh - 130px);
        position: relative;
        animation: hue-rotate-animation 5s infinite linear;
        overflow-y: auto;
      }

      .tab-bar {
        height: var(--tab-bar-height);
        border-top: var(--default-border-style);
        font-size: var(--font-size-normal);
      }
    }
  }
</style>
