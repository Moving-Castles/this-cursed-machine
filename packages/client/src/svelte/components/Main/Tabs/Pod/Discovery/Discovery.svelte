<script lang="ts">
  import type { Discovery } from "."
  import { scale, fade } from "svelte/transition"
  import { staticContent } from "@modules/content"
  import { onMount } from "svelte"
  import { createEventDispatcher } from "svelte"
  import { urlFor } from "@modules/content/sanity"

  const dispatch = createEventDispatcher<{ end: Discovery }>()

  export let discovery: Discovery

  const close = () => dispatch("end", discovery)

  const lore = $staticContent.materials.find(mat => {
    return mat.materialType
      .replaceAll(" ", "_")
      .toLowerCase()
      .startsWith(discovery.name.replaceAll(" ", "_").toLowerCase())
  })

  const color = lore?.color?.hex || "var(--color-failure)"

  onMount(() => {
    setTimeout(close, 8000)
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  style="--material-color: {color}"
  class="discovery absolute {discovery.name}"
  in:scale={{ duration: 200 }}
  out:fade={{ duration: 600 }}
  on:click={close}
>
  <div class="image">
    {#if lore}
      <img
        class="image"
        src={urlFor(lore.image).width(200).auto("format").url()}
        alt={discovery.name}
      />
    {/if}
  </div>
  <div class="content">
    <p>New material discovered</p>
    <p class="material">
      {discovery.name.replace(/! $/, "")}
    </p>
    {#if lore}
      <p>
        {#if lore.category}
          {lore.category}
        {/if}
      </p>
    {/if}
  </div>
</div>

<style lang="scss">
  .discovery {
    text-align: left;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    gap: 0.5rem;
    color: var(--foreground);
    padding: 0.5rem;
    cursor: pointer;
    border: 2px solid var(--material-color);
    color: var(--material-color);
    background: var(--black);
    margin-top: 10px;
    font-size: var(--font-size-small);
    overflow: hidden;
    word-break: break-all;

    .content {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      gap: 0.5rem;
      .material {
        font-size: var(--font-size-normal);
        color: var(--white);
        margin-bottom: 1rem;
      }
    }
    .image {
      width: 60px;
    }
  }

  @keyframes side-to-side {
    0% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(40px, 0);
    }
    20% {
      transform: translate(-40px, 0);
    }
    30% {
      transform: translate(30px, 0);
    }
    40% {
      transform: translate(-30px, 0);
    }
    60% {
      transform: translate(20px, 0);
    }
    70% {
      transform: translate(-20px, 0);
    }
    80% {
      transform: translate(10px, 0);
    }
    90% {
      transform: translate(-10px, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes fly-up {
    from {
      bottom: 0;
      opacity: 1;
    }

    to {
      bottom: 400px;
      opacity: 0;
    }
  }

  @keyframes wobble {
    0%,
    100% {
      transform: translateY(0) rotate(0);
      transform-origin: 50% 50%;
    }

    15% {
      transform: translateY(-30px) rotate(6deg);
    }

    30% {
      transform: translateY(15px) rotate(-6deg);
    }

    45% {
      transform: translateY(-15px) rotate(3.6deg);
    }

    60% {
      transform: translateY(9px) rotate(-2.4deg);
    }

    75% {
      transform: translateY(-6px) rotate(1.2deg);
    }
  }
</style>
