<script lang="ts">
  export let address: string
  export let connection: Connection
  import {
    connectionSourceMachine,
    connectionTargetMachine,
  } from "../../modules/state/convenience"
  import { MachineType, MaterialType } from "../../modules/state/enums"
  import { MATERIAL_LORE, MATERIAL_IMAGES } from "../../modules/content/lore"

  console.log(address)
  // List contents etc

  $: connectionLore = MATERIAL_LORE[connection.product?.materialType]
  $: connectionImage = MATERIAL_IMAGES[connection.product?.materialType]
  $: fromMachine = connectionSourceMachine(address)
  $: toMachine = connectionTargetMachine(address)
</script>

<div class="material-information">
  <p class="muted">
    Connection transporting <span
      style:color="var(--{MaterialType[connection.product?.materialType]})"
      >{MaterialType[connection.product?.materialType]}</span
    >
    from {MachineType[fromMachine.machineType]} to {MachineType[
      toMachine.machineType
    ]}
  </p>

  {#if connectionImage !== ""}
    <div
      class="filtered"
      style:background-color="var(--{MaterialType[
        connection.product?.materialType
      ]})"
    >
      <img
        src={connectionImage}
        class="connection-image"
        alt={MaterialType[connection.product?.materialType]}
      />
    </div>
  {/if}
  <p>
    {connectionLore}
  </p>

  <!-- {#if connection?.product || machine?.outputs}
    <div class="flex">
      <div class="inputs">
        {#if machine?.inputs}
          <p>IN</p>
          {#each machine?.inputs as input}
            <p class="muted">
              {MaterialType[input.materialType]}: {input.amount}
            </p>
          {/each}
        {/if}
      </div>
      <div class="divider">
        |<br />
        |<br />
      </div>
      <div class="outputs">
        {#if machine?.outputs}
          <p>OUT</p>
          {#each machine?.outputs as output}
            <p class="muted">
              {MaterialType[output.materialType]}: {output.amount}
            </p>
          {/each}
        {/if}
      </div>
    </div>
  {/if} -->
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
