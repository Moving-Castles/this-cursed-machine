<script lang="ts">
  import { fly } from "svelte/transition"
  import { stepsEasing } from "../../modules/utils/misc"
  // import { staticContent } from "../../modules/content"
  // import { urlFor } from "../../modules/content/sanity"
  import { playSound } from "../../modules/sound"
  import { showMap } from "../../modules/ui/stores"
  const onKeyDown = ({ key }) => {
    if (key === "Escape") showMap.set(false)
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div
  in:fly={{ y: -40, duration: 200, easing: stepsEasing }}
  out:fly={{ y: 40, duration: 200, easing: stepsEasing }}
  class="map-container"
>
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    src="/images/map.png"
    alt="map"
    on:click={() => {
      // playSound("tcm", "buzzer")
      showMap.set(false)
    }}
  />
  <!-- <img src={urlFor($staticContent.map.image.asset).url()} alt="map" /> -->
</div>

<style lang="scss">
  .map-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;

    img {
      width: 1200px;
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      cursor: pointer;
    }
  }
</style>
