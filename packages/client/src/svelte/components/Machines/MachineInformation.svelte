<script lang="ts">
  export let address: string
  export let machine: Machine // can be numerical or string
  import { machineTypeToLabel } from "../../modules/state/convenience"
  import { MaterialType, MachineType } from "../../modules/state/enums"
  import { MACHINE_LORE } from "../../modules/content/lore"

  // List contents etc

  const machineLore = MACHINE_LORE[machine.machineType]
</script>

<div class="machine-information">
  {machine.machineType === MachineType.CORE
    ? "YOU (Stump #24719)"
    : machineTypeToLabel(machine.machineType)}
  <p class="muted">
    {machineLore}<br />
    -------------------
  </p>
  {#if machine?.inputs || machine?.outputs}
    <div class="flex">
      <p class="inputs">
        {#if machine?.inputs}
          <p class="muted">IN</p>
          {#each machine?.inputs as input}
            <p>
              <span style:color="var(--{MaterialType[input.materialType]})"
                >{MaterialType[input.materialType]}</span
              >: {input.amount}
            </p>
          {/each}
        {/if}
      </p>
      <div class="outputs">
        {#if machine?.outputs && machine.machineType !== MachineType.OUTLET}
          <p class="muted">OUT</p>
          {#each machine?.outputs as output}
            <p>
              <span style:color="var(--{MaterialType[output.materialType]})"
                >{MaterialType[output.materialType]}</span
              >: {output.amount}
            </p>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
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
</style>
