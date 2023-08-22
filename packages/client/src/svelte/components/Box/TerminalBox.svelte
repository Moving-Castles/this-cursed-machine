<script lang="ts">
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

    &.light {
      background: white;
    }
  }
</style>
