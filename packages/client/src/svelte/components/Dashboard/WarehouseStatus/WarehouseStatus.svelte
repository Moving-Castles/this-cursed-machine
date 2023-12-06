<script lang="ts">
  import { warehouseMaterials } from ".."
  import WarehouseHeader from "./WarehouseHeader.svelte"
  import WarehouseItem from "./WarehouseItem.svelte"

  /**
   * Consolidates an array of materials based on their type and sorts them in ascending order by amount.
   *
   * @param {Material[]} materials - An array of Material objects to be consolidated.
   * @returns {Material[]} A sorted array of consolidated Material objects.
   */
  function consolidateWarehouse(materials: Material[]): Material[] {
    // Create an object to hold consolidated materials.
    const consolidatedMaterials: { [key: string]: Material } = {}

    // Iterate over each material in the input array.
    materials.forEach(material => {
      const type = material.materialType

      // If the material type already exists in consolidatedMaterials, add to its amount.
      if (consolidatedMaterials[type]) {
        consolidatedMaterials[type].amount += material.amount
      }
      // If the material type is not yet in consolidatedMaterials, add it.
      else {
        consolidatedMaterials[type] = { ...material }
      }
    })

    // Convert the object to an array and sort the array by the amount in ascending order.
    return Object.values(consolidatedMaterials).sort(
      (a, b) => a.amount - b.amount,
    )
  }

  let consolidatedMaterials: Material[] = consolidateWarehouse(
    Object.values($warehouseMaterials),
  )
  $: consolidatedMaterials = consolidateWarehouse(
    Object.values($warehouseMaterials),
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
    overflow-y: scroll;

    .header {
      padding-top: 20px;
      padding-left: 20px;
      padding-bottom: 1em;
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
