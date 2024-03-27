<script lang="ts">
  // import { TABS } from "@modules/ui/enums"
  import { activeTab } from "@modules/ui/stores"
  import { playSound } from "@modules/sound"
  import type { TabDefinitions } from "../types"
  export let tabList: TabDefinitions

  function toggleTabByKeyboard(e: KeyboardEvent) {
    const keyPressed = e.key
    const numericKey = parseInt(keyPressed, 10) // Convert the key pressed to a number

    // Check if the key is a number and within the valid range of tabList
    if (
      !isNaN(numericKey) &&
      numericKey >= 0 &&
      numericKey < Object.keys(tabList).length
    ) {
      const tabKeys = Object.keys(tabList).map(key => parseInt(key, 10))
      const tabKey = tabKeys[numericKey] // Get the actual key of the tab from tabList

      if (tabList[tabKey].enabled) {
        // Check if the tab is enabled
        playSound("tcm", "selectionEnter")
        activeTab.set(tabKey) // Set the active tab using the key from tabList
      }
    }
  }
</script>

<div class="tab-bar">
  {#each Object.entries(tabList) as [key, value], index}
    <div class="button-container">
      <button
        class:enabled={value.enabled}
        class:active={key === $activeTab}
        class:pulse={index == 1}
        on:click={() => {
          playSound("tcm", "selectionEnter")
          activeTab.set(key)
        }}
      >
        {value.label}
      </button>
    </div>
  {/each}
</div>

<!-- <svelte:window on:keydown={e => toggleTabByKeyboard(e)} /> -->

<style lang="scss">
  .tab-bar {
    width: 100%;
    height: 100%;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    padding-inline: 20px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);

    .button-container {
      width: 20%;

      button {
        width: 100%;
        padding: 10px;
        background: darkgrey;
        border: 1px solid rgb(76, 54, 58);
        border-right: none;
        font-family: var(--font-family);
        font-size: var(--font-size-normal);
        // font-family: "SixtyFour", "Permanent Marker";
        // // font-size: 22px;
        opacity: 0.3;
        pointer-events: none;
        user-select: none;

        &:last-child {
          border-right: 1px solid rgb(76, 54, 58);
        }

        &.active {
          background: grey;
        }

        &.pulse {
          animation: pulse 0.8s infinite alternate ease-out;
        }

        &.enabled {
          opacity: 1;
          pointer-events: all;

          &:hover {
            background: grey;
            cursor: crosshair;
          }
        }
      }
    }
  }

  @keyframes pulse {
    0% {
      background: grey;
      // opacity: 1;
    }
    100% {
      background: darkgrey;
      // opacity: 0.7;
    }
  }
</style>
