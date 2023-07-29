<script>
  import SvelteMarkdown from "svelte-markdown"
  import { fade } from "svelte/transition"
  import { explainer, explanation } from "../../modules/content/wiki"
</script>

<div in:fade={{ duration: 100 }} class="explainer">
  <SvelteMarkdown source={$explanation} />

  <button on:click={() => ($explainer = "")}>Close</button>
</div>

<style>
  .explainer {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999999999999;
    background: rgb(20, 20, 20);
    color: white;
    overflow: hidden;
    padding: 40px;
  }
</style>
