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
  .split-screen {
    // Display properties are set in app.css

    .left-col {
      height: 100vh;
      overflow: hidden;
      border-right: 5px double var(--color-border);
    }

    .right-col {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr)) 150px 150px;
      grid-template-rows: 250px 1fr;
      overflow: hidden;
      position: relative;

      .stats {
        grid-column: 1 / 7;
        border-bottom: 5px double var(--color-border);
      }
    }
  }

  .graph {
    grid-column: 1 / 7;
    position: relative;
  }
</style>
