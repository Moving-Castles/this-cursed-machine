<script lang="ts">
  import { activeTab } from "@modules/ui/stores"
  import { playSound } from "@modules/sound"
  import { advanceTutorial, tutorialProgress } from "@modules/ui/assistant"
  import type { TabDefinitions } from "../types"
  export let tabList: TabDefinitions

  const HIDDEN_CONDITIONS: {
    [key: number]: number
  } = {
    0: 0,
    1: 0,
    2: 8,
    3: 17,
    4: 26,
  }

  const PULSE_CONDITIONS: {
    [key: number]: number[]
  } = {
    0: [20, 3],
    1: [1, 7, 15],
    2: [9, 17, 25],
    3: [18],
    4: [27],
  }

  $: advanceTutorial($activeTab, $tutorialProgress, "tab")

  $: availableTabsLength = Object.values(HIDDEN_CONDITIONS).filter(
    num => $tutorialProgress > num,
  ).length

  const onKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation()
    if (e.key.toLowerCase() === "tab") {
      if (e.shiftKey) {
        activeTab.set(($activeTab - 1) % availableTabsLength)
      } else {
        activeTab.set(($activeTab + 1) % availableTabsLength)
      }
      playSound("tcm", "selectionEnter")
      advanceTutorial($activeTab, $tutorialProgress, "tab")
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="tab-bar">
  {#each Object.entries(tabList) as [key, value] (`${key}-${$tutorialProgress}`)}
    <div class="button-container">
      <button
        tabIndex={Number(key)}
        disabled={$tutorialProgress <= HIDDEN_CONDITIONS[Number(key)]}
        class:enabled={value.enabled}
        class:active={Number(key) === $activeTab}
        class:pulse={PULSE_CONDITIONS[Number(key)].includes($tutorialProgress)}
        class:hidden={$tutorialProgress <= HIDDEN_CONDITIONS[Number(key)]}
        on:click={() => {
          playSound("tcm", "selectionEnter")
          activeTab.set(Number(key))
        }}
      >
        {value.label}
      </button>
    </div>
  {/each}
</div>

<style lang="scss">
  .tab-bar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-inline: 20px;

    .button-container {
      width: 20%;

      button {
        width: 100%;
        padding: 10px;
        background: var(--color-grey-mid);
        font-family: var(--font-family);
        font-size: var(--font-size-normal);
        border: none;
        opacity: 0.3;
        pointer-events: none;
        user-select: none;

        &:last-child {
          border-right: 1px solid var(--color-grey-dark);
        }

        &.hidden {
          opacity: 0.2 !important;
          pointer-events: none;
        }

        &.enabled {
          opacity: 1;
          pointer-events: all;

          &:hover {
            background: var(--color-grey-light);
            cursor: crosshair;
          }

          &.active {
            background: var(--foreground);
          }

          &:disabled:hover {
            background: var(--color-grey-mid);
            cursor: not-allowed;
          }
        }
      }
    }
  }
</style>
