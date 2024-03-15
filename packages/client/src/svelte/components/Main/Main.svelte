<script lang="ts">
  import { onMount } from "svelte"
  import { player } from "@modules/state/base/stores"
  import { playSound } from "@modules/sound"

  import Terminal from "@components/Main/Terminal/Terminal.svelte"
  import InfoBar from "@components/Main/Bars/InfoBar.svelte"
  import TabBar from "@components/Main/Bars/TabBar.svelte"
  import OrderBar from "@components/Main/Bars/OrderBar.svelte"

  import { TABS } from "@modules/ui/enums"
  import { activeTab } from "@modules/ui/stores"

  import Pod from "@components/Main/Tabs/Pod/Pod.svelte"
  import Orders from "@components/Main/Tabs/Orders/Orders.svelte"
  import Inbox from "@components/Main/Tabs/Inbox/Inbox.svelte"
  import Chat from "@components/Main/Tabs/Chat/Chat.svelte"
  import Exit from "@components/Main/Tabs/Exit/Exit.svelte"
  import Shop from "@components/Main/Tabs/Shop/Shop.svelte"

  $: tabList = {
    [TABS.POD]: {
      label: "Pod",
      component: Pod,
      enabled: true,
    },
    [TABS.INBOX]: {
      label: "Inbox",
      component: Inbox,
      enabled: true,
    },
    [TABS.ORDERS]: {
      label: "Orders",
      component: Orders,
      enabled: $player.tutorial ? false : true,
    },
    [TABS.SHOP]: {
      label: "Shop",
      component: Shop,
      enabled: $player.tutorial ? false : true,
    },
    [TABS.CHAT]: {
      label: "Chat",
      component: Chat,
      enabled: $player.tutorial ? false : true,
    },
    [TABS.EXIT]: {
      label: "Exit",
      component: Exit,
      enabled: $player.tutorial ? false : true,
    },
  }

  type ComponentType =
    | null
    | typeof Pod
    | typeof Inbox
    | typeof Orders
    | typeof Exit
    | typeof Shop
    | typeof Chat

  let currentTabComponent: ComponentType = null

  // Reactive statement to update CurrentComponent based on the activeTab value
  $: {
    currentTabComponent = tabList[$activeTab]?.component || null
  }

  let terminalComponent: any

  const handleCommand = async () => {
    terminalComponent.resetInput()
  }

  onMount(() => {
    playSound("tcm", "podBg", true, false)
  })
</script>

{#if $player?.carriedBy}
  <div class="bg">
    <div class="split-screen">
      <div class="left-col">
        <div class="status-bar">
          <InfoBar />
        </div>
        <div class="terminal">
          <Terminal
            bind:this={terminalComponent}
            on:commandExecuted={() => handleCommand()}
            setBlink
            placeholder="HELP"
          />
          <div class="terminal-overlay" />
        </div>
      </div>
      {#if $player}
        <div class="right-col">
          <div class="status-bar">
            <OrderBar />
          </div>
          <div class="tab-container">
            <!-- Render the CurrentComponent if it's not null -->
            {#if currentTabComponent}
              <svelte:component this={currentTabComponent} />
            {/if}
          </div>
          <div class="tab-switch">
            <TabBar {tabList} />
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  .split-screen {
    display: flex;
    height: 100vh;

    .left-col {
      height: 100%;
      width: 500px;
      overflow: hidden;
      border-right: 5px double var(--color-border);

      .status-bar {
        height: 40px;
        border-bottom: 5px double var(--color-border);
        color: white;
        font-size: 14px;
      }

      .terminal {
        height: calc(100vh - 40px);
        position: relative;
      }

      .terminal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 0, 0, 1);
        // background-image: url(/images/noise2.png);
        background-size: 100px 100px;
        background-image: url(/images/scanlines.png);
        background-size: 400px 400px;
        // filter: blur(1px);
        // backdrop-filter: blur(1px);
        // backdrop-filter: invert(1);
        // backdrop-filter: saturate(100%);
        // mix-blend-mode: difference;
        mix-blend-mode: hard-light;
        opacity: 0.2;
        z-index: 10;
      }
    }

    .right-col {
      height: 100%;
      width: calc(100vw - 500px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;

      .status-bar {
        height: 40px;
        border-bottom: 5px double var(--color-border);
        font-size: 14px;
      }

      .tab-container {
        height: calc(100vh - 140px);
        position: relative;
        animation: hue-rotate-animation 5s infinite linear;
      }

      .tab-switch {
        height: 100px;
        border-top: 5px double var(--color-border);
        font-size: 14px;

        button {
          all: revert;
        }
      }
    }
  }
</style>
