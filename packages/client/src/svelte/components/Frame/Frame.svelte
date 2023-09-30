<script lang="ts">
  import { onMount } from "svelte"
  export let name = ""

  let blink = false

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const blinkFn = async () => {
    const openTime = Math.random() * 300 + 100
    const closedTime = Math.random() * 7000 + 200
    // console.log(openTime, closedTime)
    blink = true
    await sleep(openTime)
    blink = false
    await sleep(closedTime)
    blinkFn()
  }

  onMount(blinkFn)
</script>

{#if name === "intro"}
  {#if !blink}
    <img class="frame-content" src="/images/f1.png" alt="here we go again" />
  {:else}
    <img class="frame-content" src="/images/f2.png" alt="here we go again" />
  {/if}
{/if}

<style>
  .frame-content {
    max-width: 100%;
  }
</style>
