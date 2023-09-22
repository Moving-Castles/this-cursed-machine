<script lang="ts">
  import { blocksSinceLastResolution, simulated } from "../../modules/simulator"
  import {
    MachineType,
    EntityType,
    MaterialType,
  } from "../../modules/state/enums"
  import { machines, playerBox, playerCore } from "../../modules/state"
  import { hexToString, stringToHex } from "../../modules/utils/misc"
  import { shortenAddress } from "../../modules/utils/misc"
  export let box: Box
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box-stats">
  <p>
    *** XXXXXXXXXXXXXXXX ***<br />XXX YOUR SKINNER BOX XXX
    <br />*** XXXXXXXXXXXXXXXX ***<br /><br />

    ID (encoded):<br />
    {hexToString($playerCore.carriedBy)}
  </p>

  <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
  <p
    role="button"
    class="agreement"
    on:click={() => {
      // terminal send some text
    }}
  >
    ************************<br />*** READ &nbsp;&nbsp;AGREEMENT ***<br
    />************************
  </p>

  <p>Contents:</p>
  {#each Object.entries($simulated) as [key, entity] (key)}
    <div>
      {#if entity.entityType === EntityType.MACHINE}
        ---<br />
        <p>
          <strong>{MachineType[entity.machineType]}</strong> ({shortenAddress(
            key
          )})
        </p>
        {#if entity.machineType == MachineType.CORE}
          <p>
            ENERGY {entity.energy + $blocksSinceLastResolution}
          </p>
        {/if}
        <!-- INPUTS -->

        {#if entity.machineType !== MachineType.INLET && entity.inputs && entity.inputs.length > 0}
          {#each entity.inputs as product}
            <p>
              [IN]
              {MaterialType[product.materialType]}
              {product.amount}/block
              <!-- {getAdjective(product.temperature)} -->
            </p>
          {/each}
        {/if}
        <!-- OUTPUTS -->
        {#if entity.outputs && entity.outputs.length > 0}
          {#each entity.outputs as product}
            <p>
              [OUT]
              {MaterialType[product.materialType]}
              {#if entity.machineType == MachineType.OUTLET}
                <strong>{product.amount * $blocksSinceLastResolution}</strong>
              {:else}
                {product.amount}/block
              {/if}
              <!-- {getAdjective(product.temperature)} -->
            </p>
          {/each}
        {/if}
      {/if}
    </div>
  {/each}
</div>

<style>
  .box-stats {
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
    margin: 0;
  }
  .agreement-button {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
