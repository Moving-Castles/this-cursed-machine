<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"
  import { playerCore, levels } from "../../modules/state"
  import { playSound } from "../../modules/sound"

  import Terminal from "../Terminal/Terminal.svelte"
  import BoxStats from "../Box/BoxStats.svelte"
  import Graph from "../Graph/Graph.svelte"
  import LevelModal from "../LevelModal/LevelModal.svelte"
  import Tooltips from "../Tooltip/Tooltips.svelte"
  import Map from "../Map/Map.svelte"
  import { showLevelModal, showMap } from "../../modules/ui/stores"
  import { simulatedPlayerEnergy } from "../../modules/simulator"

  const dispatch = createEventDispatcher()

  let terminalComponent: any

  $: if ($playerCore && $simulatedPlayerEnergy === 0) {
    dispatch("dead")
  }

  // Levels are done, show the dashboard
  $: if ($playerCore.level > Object.keys($levels).length) {
    dispatch("completed")
  }

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

{#if $playerCore.carriedBy}
  <div class="bg">
    <div class="split-screen">
      <div class="left-col">
        <Terminal
          bind:this={terminalComponent}
          on:commandExecuted={e => handleCommand(e)}
          setBlink
          placeholder="HELP"
        />
      </div>
      {#if $playerCore}
        <div class="right-col">
          <!-- <div class="scanlines" /> -->
          <!-- <div class="scanlines2" /> -->
          <div class="stats">
            <BoxStats />
          </div>
          <div class="graph">
            <Graph />
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<Tooltips />

<style lang="scss">
  .box {
    position: fixed;
    top: 0;
    left: 0;
    padding: 40px;
    height: calc(100vh - 20px);
    width: calc(100vw - 20px);
    background-color: #444;
    font-size: var(--font-size-normal);
    z-index: 1000;
  }

  .scanlines {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    // background: url(/images/scanlines.gif);
    background: url(/images/vhs.webp);
    background-size: 100% 100%;
    mix-blend-mode: lighten;
    z-index: 1010000000;
  }

  .scanlines2 {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    background: url(/images/scanlines.gif);
    // background: url(/images/vhs.webp);
    background-size: 100% 100%;
    mix-blend-mode: multiply;
    z-index: 1010000000;
  }

  .split-screen {
    // Display properties are set in app.css

    .left-col {
      height: calc(100vh - 20px);
      overflow: hidden;
      border: 1px solid #fff;
      margin: 10px;
    }

    .right-col {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr)) 150px 150px;
      grid-template-rows: 250px 1fr;
      overflow: hidden;
      position: relative;
      margin: 10px;
      margin-left: 0;

      .stats {
        grid-column: 1 / 7;
        border: 1px solid white;
      }
    }
  }

  .icon {
    height: 50px;
    width: 50px;
  }

  .flowchart-container {
    position: fixed;
    top: 0;
    left: 0;
    padding: 2rem;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--terminal-background);
  }

  .graph {
    grid-column: 1 / 7;
    position: relative;
    // background: red;
  }

  .graph-container {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.8);
  }

  .inline-flowchart {
    padding: 100px;
  }

  .esc {
    position: fixed;
    z-index: 9999;
    margin: 2rem;
    top: 0;
    right: 0;
    font-family: var(--font-family);
    cursor: pointer;
    color: var(--terminal-color);
  }
</style>
