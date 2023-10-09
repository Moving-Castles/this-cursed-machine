<script lang="ts">
  import { showGraph, lastSentTime } from "../../modules/ui/stores"
  import { blockNumber } from "../../modules/network"
  import { playerBox, playerCore } from "../../modules/state"
  import { boxOutput } from "../../modules/simulator"
  import Terminal from "../Terminal/Terminal.svelte"
  import BoxStats from "../Box/BoxStats.svelte"
  import Graph from "../Graph/MachinesSVG/Wrapper.svelte"
  import Goal from "../Goal/Goal.svelte"
  // import BoxMaterial from "./BoxMaterial.svelte"

  let now = performance.now()

  $: if ($blockNumber) now = performance.now()

  let send: (string: string) => Promise<void>

  let theme = "dark"
</script>

<div class="bg">
  <div class="split-screen">
    <div class="left-col">
      <Terminal
        on:show={() => ($showGraph = true)}
        bind:theme
        bind:send
        stage={false}
        track={false}
        animated={false}
        placeholder={"Help"}
      />
    </div>
    {#if $playerCore}
      <div class="right-col">
        <div class="stats">
          <BoxStats />
        </div>
        <div class="goal">
          <Goal />
        </div>

        <div class="graph">
          <Graph />
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .box {
    position: fixed;
    top: 0;
    left: 0;
    padding: 40px;
    height: 100vh;
    width: 100vw;
    background-color: #444;
    font-size: var(--font-size-normal);
    z-index: 1000;
  }

  .split-screen {
    // Display properties are set in app.css

    .left-col {
      height: 100%;
      overflow: hidden;
    }

    .right-col {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr)) 150px 150px;
      grid-template-rows: 250px 1fr;
      overflow: hidden;

      .stats {
        grid-column: 1 / 4;
        outline: var(--terminal-border);
        outline-offset: -6px;
      }

      .goal {
        grid-column: 5 / 7;
        outline: var(--terminal-border);
        outline-offset: -4px;
        position: relative;

        .bg {
          width: 100%;
          height: 100%;
          background-size: 200px 200px;
          background-position: center;
          filter: brightness(2) opacity(0.7) contrast(2) opacity(0.2);
          pointer-events: none;
          position: absolute;
          inset: 0;
        }
      }
    }
  }

  .icon {
    height: 50px;
    width: 50px;
  }

  .bg {
    // position: fixed;
    // inset: 0;
    // transition: background 2s ease, border 2s ease, color 2s ease;
    // background: var(--terminal-background);
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
  }

  .graph-container {
    position: fixed;
    /* background: red; */
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
