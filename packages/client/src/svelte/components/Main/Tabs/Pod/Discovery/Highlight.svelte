<script lang="ts">
  import type { Discovery } from "."
  import { urlFor } from "@modules/content/sanity"
  export let discovery: Discovery
  const color = discovery.color?.hex || "var(--color-failure)"
</script>

<div class="discovery-highlight" style="--material-color: {color}">
  <div class="contents">
    <img
      class="image"
      src={urlFor(discovery.image).width(400).auto("format").url()}
      alt={discovery.title}
    />
    <div class="">
      <h1 class="title">
        {discovery.title} ({discovery.name})
      </h1>
      <p class="subtitle">{discovery.category}</p>
    </div>
  </div>
  <div role="button" on:click class="close">Close (Esc)</div>
</div>

<style lang="scss">
  .discovery-highlight {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding: 1rem 1rem 0;
    font-size: var(--font-size-normal);
    text-align: left;
    justify-content: space-between;
    display: flex;
    flex-flow: column nowrap;

    .contents {
      display: flex;
      flex-flow: column nowrap;
      gap: 0.5rem;
      height: 100%;
    }

    .close {
      height: 3rem;
      width: 100%;
      text-align: right;
      color: var(--color-failure);
      font-size: var(--font-size-small);
      padding: 1rem;
      cursor: pointer;
    }

    .image {
      width: 100%;
      border: 2px solid var(--material-color);
      opacity: 1;
    }

    .title {
      font-size: var(--font-size-normal);
    }

    .subtitle {
      font-size: var(--font-size-small);
      color: var(--material-color);
    }
  }
</style>
