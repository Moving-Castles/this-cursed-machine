<script lang="ts">
  import { materialTypeToLabel } from "../../../modules/state/convenience"
  export let material: Material
</script>

<div class="warehouse-item" class:self>
  <div class="material">{materialTypeToLabel(material.materialType)}</div>
  <div class="amount">{material.amount}</div>
</div>

<style lang="scss">
  .warehouse-item {
    display: flex;
    padding-bottom: 1em;

    .material {
      width: 50%;
      color: var(--color-alert);
    }

    .amount {
      width: 50%;
    }
  }
</style>
