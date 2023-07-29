<script lang="ts">
  import { onMount } from "svelte"
  import { initSignalNetwork } from "../../modules/signal"
  import MinimalExecutor from "../Executor/MinimalExecutor.svelte"
  import Presence from "../Presence/Presence.svelte"
  import LeaderBoard from "../LeaderBoard/LeaderBoard.svelte"
  import Map from "../Map/Map.svelte"
  import Tweak from "../Tweak/Tweak.svelte"
  import { config } from "../../modules/content/lore"
  // import DragState from "../DragState/DragState.svelte"
  // import RawDebug from "./RawDebug.svelte"

  // We have to wait until the chains state is loaded and the player is spawned
  onMount(initSignalNetwork)
</script>

<!-- Off chain signaling -->
<Presence />
<LeaderBoard />
<Tweak />

<MinimalExecutor />

<div class="game" class:janky={$config.janky}>
  <div class="map-container">
    <Map />
  </div>
</div>

<!-- <RawDebug /> -->

<style lang="scss">
  .game {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 18px;
    gap: 20px;
    z-index: 1000;

    &.janky {
      // filter: saturate(20) blur(0.5px) contrast(1.2) ;

      :global(*) {
        font-weight: bold;
        text-transform: uppercase;
      }
      // filter: blur(5px);
      // filter: brightness(0.4);
      // filter: contrast(200%);
      // filter: drop-shadow(16px 16px 20px blue);
      // filter: grayscale(50%);
      // filter: hue-rotate(90deg);
      // filter: invert(75%);
      // filter: opacity(25%);
      // filter: saturate(30%);
      // filter: sepia(60%);
    }
  }
</style>
