<script lang="ts">
  import { depotAttachments } from "@modules/state/simulated/stores"
  import Attachment from "./Attachment.svelte"
  import { activeTab } from "@svelte/modules/ui/stores"

  let [innerWidth, innerHeight] = [0, 0]

  // Quick fix: only show when the first tab (pod) is active
  $: visible = $activeTab === 0
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<svg
  class="depot-connections"
  class:visible
  width={innerWidth}
  height={innerHeight}
  viewBox="0 0 {innerWidth} {innerHeight}"
>
  {#each $depotAttachments as attachment}
    <Attachment {attachment} />
  {/each}
</svg>

<style lang="scss">
  .depot-connections {
    position: absolute;
    pointer-events: none;
    /* background: rgba(0, 0, 255, 0.2); */
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;

    display: none;
    &.visible {
      display: block;
    }
  }
</style>
