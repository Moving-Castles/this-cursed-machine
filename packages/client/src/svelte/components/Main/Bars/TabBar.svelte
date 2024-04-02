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
    4: 26,
  }

  const PULSE_CONDITIONS = {
    0: [20, 3],
    1: [1, 7, 15],
    2: [9, 17, 25],
    3: [18],
    4: [27],
  }

  $: availableTabsLength = Object.values(HIDDEN_CONDITIONS).filter(
    num => $tutorialProgress >= num
  ).length

  const onKeyDown = e => {
    e.stopPropagation()
    if (e.key.toLowerCase() === "tab") {
      activeTab.set(($activeTab + 1) % availableTabsLength)
      playSound("tcm", "selectionEnter")
      console.log(tabList)
      advanceTutorial($activeTab, $tutorialProgress, "tab")
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="tab-bar">
  {#each Object.entries(tabList) as [key, value] (`${key}-${$tutorialProgress}`)}
    <div class="button-container">
      <button
        tabIndex={key}
        disabled={$tutorialProgress <= HIDDEN_CONDITIONS[key]}
        class:enabled={value.enabled}
        class:active={key == $activeTab}
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
          background: grey !important;
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
