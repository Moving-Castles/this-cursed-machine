<script lang="ts">
  import { narrative } from "../../modules/content/lore"
  import { showGraph } from "../../modules/ui/stores"
  import { playerBox } from "../../modules/state"
  import Terminal from "../Terminal/Terminal.svelte"
  import BoxStats from "../Box/BoxStats.svelte"
  import Graph from "../Graph/MachinesSVG/Wrapper.svelte"

  let theme = "dark"
</script>

<div class="bg">
  <div class="split-screen">
    <Terminal
      bind:theme
      stage={false}
      track={false}
      animated={false}
      placeholder={"[h] for help."}
      sequence={[$narrative.help]}
      on:show={() => ($showGraph = true)}
    />
    <div class="right-col">
      <div class="stats">
        <BoxStats box={$playerBox} />
      </div>
      <div class="goal">FGolad</div>

      <div class="graph">
        <Graph />
      </div>
    </div>
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
    font-size: 18px;
    z-index: 1000;
  }

  .split-screen {
    display: grid;
    grid-template-columns: 400px 1fr;
    height: 100dvh;

    > * {
      height: 100%;
      height: 100%;
    }

    .right-col {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      grid-template-rows: 300px 1fr;

      .stats {
        grid-column: 1 / 5;
        border: var(--terminal-border);
      }

      .goal {
        grid-column: 5 / 7;
        border: var(--terminal-border);
      }
    }
  }

  .icon {
    height: 50px;
    width: 50px;
  }

  .bg {
    position: fixed;
    inset: 0;
    transition: background 2s ease, border 2s ease, color 2s ease;
    background: var(--terminal-background);
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
