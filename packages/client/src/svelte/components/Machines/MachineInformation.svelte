<script lang="ts">
  export let machine: Machine // can be numerical or string
  import { MaterialType, MachineType } from "../../modules/state/enums"
  import { MACHINE_LORE } from "../../modules/content/lore"
  // List contents etc

  const machineLore = MACHINE_LORE[machine.machineType]
</script>

<div class="machine-information">
  {MachineType[machine.machineType]}
  <p class="muted">
    {machineLore}
  </p>
  {#if machine?.inputs || machine?.outputs}
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
  {/if}
</div>

<style>
  .machine-information {
    position: absolute;
    top: 0;
    left: 0;
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
</style>
