<script lang="ts">
  // import { staticContent } from "../../modules/content"
  // import { urlFor } from "../../modules/content/sanity"
  import { showMap } from "../../modules/ui/stores"
  // console.log($staticContent)
</script>

<div class="map-container">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="map"
    on:click={() => {
      showMap.set(false)
    }}
  >
    <!-- <img src={urlFor($staticContent.map.image.asset).url()} alt="map" /> -->
    <img src="/images/map.png" alt="map" />
  </div>
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

    .map {
      max-width: 90%;
      max-height: 90%;
      cursor: pointer;

      img {
        width: 1200px;
        max-width: 100%;
        height: auto;
      }
    }
  }
</style>
