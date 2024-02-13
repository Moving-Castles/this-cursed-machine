<script lang="ts">
  import {
    steppedFlyTop,
    steppedFlyBottom,
  } from "../../../modules/ui/transitions"
  import { showMap } from "../../../modules/ui/stores"
  import { playSound } from "../../../modules/sound"
  import { urlFor } from "../../../modules/content/sanity"
  import { staticContent } from "../../../modules/content"

  const onKeyDown = ({ key }) => {
    if (key === "Escape") {
      hide()
    }
  }
  const hide = () => {
    playSound("tcm", "mapClose")
    showMap.set(false)
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div in:steppedFlyTop out:steppedFlyBottom class="map-container">
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    src={urlFor($staticContent.map.image.asset).url()}
    on:click={hide}
    alt="map"
  />
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
