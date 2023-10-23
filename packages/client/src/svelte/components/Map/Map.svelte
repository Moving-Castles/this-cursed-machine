<script lang="ts">
  // import { staticContent } from "../../modules/content"
  // import { urlFor } from "../../modules/content/sanity"
  import { showMap } from "../../modules/ui/stores"
  // console.log($staticContent)
</script>

<div class="map-container">
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    src="/images/map.png"
    alt="map"
    on:click={() => {
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
