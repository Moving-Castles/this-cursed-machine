<script lang="ts">
  import { narrative } from "../../modules/content/lore"
  import {
    showFlowChart,
    showPipeChart,
    showCores,
  } from "../../modules/ui/stores"
  import { playerBox } from "../../modules/state"
  import Terminal from "../Terminal/Terminal.svelte"
  import BoxStats from "../Box/BoxStats.svelte"

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

<div class="bg">
  <div class="split-screen">
    {#if !done}
      <div>
        <Terminal
          on:done={onDone}
          animated={false}
          sequence={$narrative.intro}
          stage={false}
        />
      </div>
    {:else}
      <div>
        <Terminal
          bind:theme
          stage={false}
          track={false}
          animated={false}
          placeholder={"[h] for help. " + randomTerm}
          sequence={[$narrative.help]}
        />
      </div>
      <div>
        <BoxStats box={$playerBox} />
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
    font-size: 18px;
    z-index: 1000;
  }

  .split-screen {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    height: 100dvh;

    > * {
      height: 100%;
      max-height: 100dvh;
      padding: 1rem;
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
