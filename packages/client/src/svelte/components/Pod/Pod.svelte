<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"
  import { playerEntity, levels } from "../../modules/state"
  import { playSound } from "../../modules/sound"

  import { showLevelModal, showMap } from "../../modules/ui/stores"

  import Terminal from "../Terminal/Terminal.svelte"
  import Graph from "../Graph/Graph.svelte"
  import LevelModal from "../LevelModal/LevelModal.svelte"
  import Tooltips from "../Tooltip/Tooltips.svelte"
  import Map from "../Map/Map.svelte"
  import StorageBox from "../Storage/StorageBox.svelte"

  //   const dispatch = createEventDispatcher()

  let terminalComponent: any

  // Levels are done, show the dashboard
  // $: if ($playerEntity.level > Object.keys($levels).length) {
  //   dispatch("completed")
  // }

  const handleCommand = async (e: any) => {
    terminalComponent.resetInput()
  }

  onMount(() => {
    playSound("tcm", "podBg", true, false)
  })
</script>

{#if $showLevelModal}
  <LevelModal />
{/if}

{#if $showMap}
  <Map />
{/if}

{#if $playerEntity.carriedBy}
  <div class="bg">
    <div class="split-screen">
      <div class="left-col">
        <div class="status-bar"><p>Stump #{$playerEntity.spawnIndex}</p></div>
        <div class="terminal">
          <Terminal
            bind:this={terminalComponent}
            on:commandExecuted={e => handleCommand(e)}
            setBlink
            placeholder="HELP"
          />
        </div>
      </div>
      {#if $playerEntity}
        <div class="right-col">
          <div class="status-bar">CURRENT ORDER:</div>
          <div class="stats">
            <StorageBox />
          </div>
          <div class="graph">
            <Graph />
          </div>
          <div class="tab-switch">POD / MAP/ ORDERS / LEADERBOARD / CHAT</div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<Tooltips />

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
        background: yellow;
        border-bottom: 5px double var(--color-border);
        color: black;
        font-size: 14px;
      }

      .terminal {
        height: calc(100vh - 40px);
        position: relative;
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
        background: blue;
        border-bottom: 5px double var(--color-border);
        font-size: 14px;
      }

      .stats {
        height: 200px;
        border-bottom: 5px double var(--color-border);
      }

      .graph {
        height: calc(100vh - 280px);
        position: relative;
      }

      .tab-switch {
        height: 40px;
        border-top: 5px double var(--color-border);
        background: red;
        font-size: 14px;
      }
    }
  }
</style>
