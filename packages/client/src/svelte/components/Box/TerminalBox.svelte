<script lang="ts">
  import { narrative } from "../../modules/content/lore"
  import { showFlowChart } from "../../modules/ui/stores"
  import Terminal from "../Terminal/Terminal.svelte"
  import FlowChart from "../FlowChart/FlowChart.svelte"

  let done = false

  $: randomTerm = [
    "Everything is hard before it is easy.",
    "Nothing is more frightful than to see ignorance in action.",
    "Nothing is more damaging to a new truth than an old error.",
    "At night, that’s when you mess up. So if you go to bed at 9.30, you’re good.",
    "Being famous is just a job",
    "I think it’s an okay thing to express yourself",
  ][Math.floor(Math.random() * 6)]

  const onDone = () => {
    done = true
    setTimeout(() => {
      theme = "light"
    }, 1000)
  }

  let theme = "dark"
</script>

{#if $showFlowChart}
  <div class="esc" on:click={() => ($showFlowChart = false)}>(esc)</div>

  <div class="flowchart-container">
    <FlowChart />
  </div>
{/if}

<div class="bg">
  {#if !done}
    <Terminal on:done={onDone} sequence={$narrative.intro} />
  {:else}
    <Terminal
      bind:theme
      track={false}
      placeholder={"[h] for help. " + randomTerm}
      sequence={[$narrative.help]}
    />
  {/if}
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

  .inline-flowchart {
    padding: 100px;
  }

  .esc {
    position: fixed;
    z-index: 9999;
    margin: 2rem;
    top: 0;
    right: 0;
    font-family: monospace;
    cursor: pointer;
    color: var(--terminal-color);
  }
</style>
