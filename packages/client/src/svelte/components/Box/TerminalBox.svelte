<script lang="ts">
  import {
    playerBox,
    playerAddress,
    playerCore,
    coresInPlayerBox,
  } from "../../modules/state"
  import { addressToColor } from "../../modules/utils/misc"
  import { transfer } from "../../modules/action"
  import { narrative } from "../../modules/content/lore"
  import Terminal from "../Terminal/Terminal.svelte"

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

<div class="bg {theme}">
  {#if !done}
    <Terminal on:done={onDone} sequence={$narrative.intro} />
  {:else}
    <Terminal
      placeholder={randomTerm}
      bind:theme
      sequence={$narrative.gameLoop}
    />
  {/if}
</div>

<!-- <div class="box">
  <div
    class="icon"
    style={"background: " + addressToColor($playerAddress) + ";"}
  />
  <div>Core address: {$playerAddress}</div>
  <div>Core name: {$playerCore.name}</div>
  <div>Core creation block: {$playerCore.creationBlock}</div>
  <div>Core level: {$playerCore.level}</div>
  <div>Core rotation: {$playerCore.rotation}</div>
  <hr />
  <div
    class="icon"
    style={"background: " + addressToColor($playerCore.carriedBy) + ";"}
  />
  <div>Box level: {$playerBox.level}</div>
  <div>Box address: {$playerCore.carriedBy}</div>
  <div>Box creation block: {$playerBox.creationBlock}</div>
  <div>Min. cores: {$playerBox.minCores}</div>
  <div>Max. cores: {$playerBox.maxCores}</div>
  {#if $coresInPlayerBox.length > 0}
    <div>
      Cores in box: ({$coresInPlayerBox.length}) == {$coresInPlayerBox
        .map(c => c.name)
        .reduce((acc, val) => acc + (val + ", "))}
    </div>
  {/if}
  <div>Box width: {$playerBox.width}</div>
  <div>Box height: {$playerBox.height}</div>
  <div>Box active: {$playerBox.active}</div>
  <hr />
  {#if $playerBox.active}
    <button on:click={transfer}>Transfer</button>
  {:else}
    <div><strong>WAITING........</strong></div>
  {/if}
</div> -->

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

    &.light {
      background: white;
    }
  }
</style>
