<script lang="ts">
  import type { Connection } from "../../../modules/state/simulated/types"
  import { MATERIAL_TYPE } from "../../../modules/state/base/enums"
  import { materialTypeToLabel } from "../../../modules/state/simulated"

  export let connection: Connection
</script>

<div class="material-information">
  <p class="muted">
    {#if connection?.product}
      Transporting: <span
        style:color="var(--{MATERIAL_TYPE[connection?.product?.materialType]})"
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
</style>
