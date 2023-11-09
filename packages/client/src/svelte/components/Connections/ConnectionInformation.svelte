<script lang="ts">
  export let address: string
  export let connection: Connection

  import { MaterialType } from "../../modules/state/enums"
  import { materialTypeToLabel } from "../../modules/state/convenience"
</script>

<div class="material-information">
  <p class="muted">
    {#if connection?.product}
      Transporting: <span
        style:color="var(--{MaterialType[connection?.product?.materialType]})"
        >{materialTypeToLabel(connection?.product?.materialType)}</span
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
  .material-information {
    pointer-events: none;
  }
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
