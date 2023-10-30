<script lang="ts">
  export let address: string
  export let connection: Connection
  // import {
  //   connectionSourceMachine,
  //   connectionTargetMachine,
  // } from "../../modules/state/convenience"
  import { MachineType, MaterialType } from "../../modules/state/enums"
  // import { MATERIAL_LORE, MATERIAL_IMAGES } from "../../modules/content/lore"

  // List contents etc

  // $: connectionLore = MATERIAL_LORE[connection?.product?.materialType]
  // $: connectionImage = MATERIAL_IMAGES[connection?.product?.materialType]
  // $: fromMachine = connectionSourceMachine(address)
  // $: toMachine = connectionTargetMachine(address)
</script>

<div class="material-information">
  <p class="muted">
    {#if connection?.product}
      Transporting: <span
        style:color="var(--{MaterialType[connection?.product?.materialType]})"
        >{MaterialType[connection?.product?.materialType]
          ?.split("_")
          ?.join(" ")}</span
      >
    {:else}
      Inactive connection
    {/if}
  </p>

  <!-- <p>
    {connectionLore}
  </p> -->
</div>

<style>
  .flex {
    display: flex;
  }

  .inputs,
  .outputs {
    width: 16ch;
  }

  .divider {
    padding: 0 1ch;
  }

  .filtered {
    width: 128px;
    margin: 1ch auto;
    border: 1px solid white;
  }

  .connection-image {
    width: 100%;
    mix-blend-mode: screen;
    -webkit-filter: invert(1) grayscale(100%) contrast(200%);
    filter: invert(1) grayscale(100%) contrast(200%);
    opacity: 1;
  }
</style>
