<script lang="ts">
  import type { TabDefinitions } from "../types"
  import {
    activeTab,
    inboxRead,
    // notificationPermissions
  } from "@modules/ui/stores"
  import { discoveredMessages } from "@modules/state/simulated/stores"
  import { playSound } from "@modules/sound"
  import { staticContent } from "@modules/content"
  import { tutorialProgress, advanceTutorial } from "@modules/ui/assistant"
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

  // Filter the messages down to discovered items and then check if they are read
  $: unreadInboxItems = $staticContent.messages
    .filter(
      msg =>
        msg.tutorial || msg.graduation || $discoveredMessages.includes(msg._id)
    )
    .filter(msg => !$inboxRead.includes(msg._id))

  $: notify = unreadInboxItems.length > 0 && $tutorialProgress > 30

  $: advanceTutorial($activeTab, $tutorialProgress, "tab")

  $: availableTabsLength = Object.values(HIDDEN_CONDITIONS).filter(
    num => $tutorialProgress > num
  ).length

  const onClick = (e: MouseEvent) => {
    const key = Number(e?.currentTarget.getAttribute("tabindex"))
    if ($tutorialProgress > HIDDEN_CONDITIONS[key]) {
      activeTab.set(key)
      playSound("tcm", "selectionEnter")

      if (key === 3) {
        if (!("Notification" in window)) {
          // console.log("This browser does not support notifications.")
          return
        }

        // if ($notificationPermissions === "") {
        //   Notification.requestPermission().then(result => {
        //     notificationPermissions.set(result)
        //   })
        // }
      }
    }
  }

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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div class="button-container" tabindex={Number(key)} on:click={onClick}>
        <div
          class="tab-button"
          disabled={$tutorialProgress <= HIDDEN_CONDITIONS[key]}
          class:pulse={PULSE_CONDITIONS[key].includes($tutorialProgress) ||
            (notify && key == 2)}
          class:enabled={value.enabled}
          class:active={Number(key) === Number($activeTab)}
          class:hidden={$tutorialProgress <= HIDDEN_CONDITIONS[key]}
        >
          {value.label}
        </div>
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
            color: var(--background);
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
