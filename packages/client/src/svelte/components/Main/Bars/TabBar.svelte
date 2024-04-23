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
    1: 2,
    2: 25,
    3: 29,
  }

  const PULSE_CONDITIONS = {
    0: [6, 16],
    1: [3, 14, 24],
    2: [26],
    3: [30],
  }

  $: advanceTutorial($activeTab, $tutorialProgress, "tab")

  $: availableTabsLength = Object.values(HIDDEN_CONDITIONS).filter(
    num => $tutorialProgress > num,
  ).length

  const onKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation()
    if (e.key.toLowerCase() === "tab") {
      e.preventDefault()
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

{#if $tutorialProgress > 1}
  <div tabindex="-1" class="tab-bar">
    {#each Object.entries(tabList) as [key, value] (`${key}-${$tutorialProgress}`)}
      <div class="button-container">
        <button
          tabindex={key}
          class="tab-button"
          disabled={$tutorialProgress <= HIDDEN_CONDITIONS[key]}
          class:enabled={value.enabled}
          class:active={Number(key) === Number($activeTab)}
          class:pulse={PULSE_CONDITIONS[Number(key)].includes(
            $tutorialProgress,
          )}
          class:hidden={$tutorialProgress <= HIDDEN_CONDITIONS[key]}
          on:click={() => {
            activeTab.set(key)
            playSound("tcm", "selectionEnter")
          }}
        >
          {value.label}
        </button>
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  .tab-bar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-inline: 20px;

    .button-container {
      width: 25%;

      .tab-button {
        width: 100%;
        padding: 10px;
        background: var(--color-grey-mid);
        font-family: var(--font-family);
        font-size: var(--font-size-normal);
        border: none;
        opacity: 0.3;
        pointer-events: none;
        user-select: none;
        text-align: center;

        &.pulse {
          color: var(--background) !important;
        }

        &:last-child {
          border-right: 1px solid var(--color-grey-dark);
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
            color: var(--background);
          }

          &:disabled:hover {
            background: var(--color-grey-mid);
            cursor: not-allowed;
          }
        }

        &.hidden {
          opacity: 0.2 !important;
          pointer-events: none !important;
        }
      }
    }
  }
</style>
