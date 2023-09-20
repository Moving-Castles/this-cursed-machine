<script lang="ts">
  import { flip } from "svelte/animate"
  import { machines, connections } from "../../modules/state"
  import Connection from "../Map/Connection.svelte"
  import Machine from "../Machines/Machine.svelte"
  import "leader-line"
  export let vertical = false
  export let controls = false

  let pathOptions = ["straight", "arc", "fluid", "magnet", "grid"]

  let w = 0
  let h = 0
  let j = 0
  let pathOptionsIndex = pathOptions.length - 1
  let randomised = false

  let leaderLineConnection = "grid"

  const randomizePos = ({ key }) => {
    if (key === "c") {
      transforms = Object.fromEntries(
        Object.entries($machines).map(([_, __]) => [
          _,
          {
            x: Math.floor(Math.random() * (w - 120)) - (w - 120) / 2,
            y: Math.floor(Math.random() * (h - 120)) - (h - 120) / 2,
          },
        ])
      )
      randomised = true
      j++
    } else if (key === "t") {
      leaderLineConnection =
        pathOptions[pathOptionsIndex++ % pathOptions.length]
      j++
    }
  }

  $: transforms = Object.fromEntries(
    Object.entries($machines).map(([_, __]) => [_, { x: 0, y: 0 }])
  )
</script>

<svelte:window
  bind:innerWidth={w}
  bind:innerHeight={h}
  on:keypress={randomizePos}
/>

{#if controls}
  <div class="controls">
    (c) Change perspective (t) [{leaderLineConnection}]
  </div>
{/if}

<div class="chart" class:vertical>
  {#each Object.entries($machines) as [address, machine] (address)}
    <Machine {address} {machine} absolute={randomised} />
  {/each}
</div>

{#each Object.entries($connections) as [_, connection], i (`${_}-${$machines.length}-${j}`)}
  <Connection {connection} options={{ path: leaderLineConnection }} />
{/each}

<style lang="scss">
  .controls {
    position: fixed;
    bottom: 0;
    padding: 2rem;
    z-index: 9999;
    font-family: var(--font-family);
    color: var(--terminal-color);
  }
  .chart {
    display: flex;
    gap: 2rem;
    font-family: var(--font-family);
    color: var(--terminal-color);
    overflow: hidden;
    height: 100%;
    width: 100%;

    &.vertical {
      flex-flow: column wrap;
      justify-content: start;
      align-items: center;
    }
  }
</style>
