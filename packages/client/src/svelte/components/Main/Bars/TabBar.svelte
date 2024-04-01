<script lang="ts">
  // import { TABS } from "@modules/ui/enums"
  import { activeTab } from "@modules/ui/stores"
  import { playSound } from "@modules/sound"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"
  import type { TabDefinitions } from "../types"
  export let tabList: TabDefinitions

  const HIDDEN_CONDITIONS = {
    0: 0,
    1: 0,
    2: 8,
    3: 17,
    4: 25,
  }

  const PULSE_CONDITIONS = {
    0: [20],
    1: [1, 7, 15],
    2: [17, 25],
    3: [18],
    4: [27],
  }

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
  {#each Object.entries(tabList) as [key, value] (`${key}-${$tutorialProgress}`)}
    <div class="button-container">
      <button
        disabled={$tutorialProgress <= HIDDEN_CONDITIONS[key]}
        class:enabled={value.enabled}
        class:active={key === $activeTab}
        class:pulse={PULSE_CONDITIONS[Number(key)].includes($tutorialProgress)}
        class:hidden={$tutorialProgress <= HIDDEN_CONDITIONS[key]}
        on:click={() => {
          playSound("tcm", "selectionEnter")
          activeTab.set(key)
          advanceTutorial(key, $tutorialProgress, "tab")
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

        &.hidden {
          opacity: 0.2 !important;
          pointer-events: none;
        }

        &.enabled {
          opacity: 1;
          pointer-events: all;

          &:hover {
            background: grey;
            cursor: crosshair;
          }

          &:disabled:hover {
            background: darkgrey;
            cursor: not-allowed;
          }
        }
      }
    }
  }
</style>
