<script lang="ts">
  import { warehouseMaterials } from ".."
  import WarehouseHeader from "./WarehouseHeader.svelte"
  import WarehouseItem from "./WarehouseItem.svelte"

  function consolidateWarehouse(materials: Material[]): Material[] {
    const consolidatedMaterials: { [key: string]: Material } = {}

    materials.forEach(material => {
      const type = material.materialType
      if (consolidatedMaterials[type]) {
        consolidatedMaterials[type].amount += material.amount
      } else {
        consolidatedMaterials[type] = { ...material }
      }
    })

    return Object.values(consolidatedMaterials)
  }

  let consolidatedMaterials: Material[] = consolidateWarehouse(
    Object.values($warehouseMaterials)
  )
  $: consolidatedMaterials = consolidateWarehouse(
    Object.values($warehouseMaterials)
  )
</script>

<div class="warehouse-status">
  <div class="header">
    <div class="line"><span>****************</span></div>
    <div>
      <span>WAREHOUSE STATUS</span>
    </div>
    <div class="line"><span>****************</span></div>
  </div>

  <div class="warning">
    <div>
      <div>
        <span>PRODUCTION QUOTA NOT REACHED</span>
      </div>
    </div>
  </div>

  <div class="listing">
    <WarehouseHeader />
    {#each consolidatedMaterials as material}
      <WarehouseItem {material} />
    {/each}
  </div>
</div>

<style lang="scss">
  .warehouse-status {
    width: 50%;
    height: 100vh;

    .header {
      padding-top: 20px;
      padding-left: 20px;
      padding-bottom: 1em;
      // background: var(--color-special);
      // color: black;
      div {
        span {
          display: inline-block;
          background: var(--color-special);
          color: black;
        }
      }
    }

    .warning {
      padding-bottom: 1em;
      padding-left: 20px;
      // background: var(--color-alert);
      // color: black;
      div {
        span {
          display: inline-block;
          background: var(--color-alert);
          color: black;
        }
      }
    }

    .listing {
      padding-top: 1em;
      padding-left: 20px;
      border-top: 5px double var(--color-border);
    }
  }
</style>
