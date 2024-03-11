<script lang="ts">
  // import { TABS } from "@modules/ui/enums"
  import { activeTab } from "@modules/ui/stores"
  import { playSound } from "@modules/sound"
  import type { TabDefinitions } from "../types"
  export let tabList: TabDefinitions
</script>

<div class="tab-bar">
  {#each Object.entries(tabList) as [key, value]}
    <div class="button-container">
      <button
        class:enabled={value.enabled}
        class:active={key === $activeTab}
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
        opacity: 0.3;
        pointer-events: none;
        user-select: none;

        &:last-child {
          border-right: 1px solid rgb(76, 54, 58);
        }

        &.active {
          background: grey;
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
</style>
