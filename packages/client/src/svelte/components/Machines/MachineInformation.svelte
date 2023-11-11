<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  export let address: string
  export let machine: Machine // can be numerical or string
  import {
    machineTypeToLabel,
    materialTypeToLabel,
  } from "../../modules/state/convenience"
  import { MaterialType, MachineType } from "../../modules/state/enums"
  import { MACHINE_LORE } from "../../modules/content/lore"
  import { machineState } from "../../modules/state/convenience"
  import { playSound } from "../../modules/sound"

  let sound: Howl

  const machineLore = MACHINE_LORE[machine.machineType]

  const mapping = {
    0: "machineInactive",
    1: "machineIdle",
    2: "machineFlowing",
  }

  onMount(() => {
    sound = playSound("tcm", mapping[machineState(address)], true, true)
  })
  onDestroy(() => {
    sound.fade(1, 0, 3000)
    setTimeout(() => {
      sound?.stop()
    }, 3000)
  })
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
                >{materialTypeToLabel(input.materialType)}</span
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
                >{materialTypeToLabel(output.materialType)}</span
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
