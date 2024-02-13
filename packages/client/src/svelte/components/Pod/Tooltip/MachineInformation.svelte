<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import {
    machineTypeToLabel,
    materialTypeToLabel,
    machineState,
  } from "../../../modules/state/simulated"
  import {
    MATERIAL_TYPE,
    MACHINE_TYPE,
  } from "../../../modules/state/base/enums"
  import { MACHINE_LORE } from "../../../modules/content/lore"
  import { playSound } from "../../../modules/sound"

  export let address: string
  export let machine: Machine // can be numerical or string

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
  {machine.machineType === MACHINE_TYPE.PLAYER
    ? "YOU (Stump #24719)"
    : machineTypeToLabel(machine.machineType)}
  <p class="muted">
    <span class="tiny">{address}</span> <br />
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
              <span style:color="var(--{MATERIAL_TYPE[input.materialType]})"
                >{materialTypeToLabel(input.materialType)}</span
              >: {input.amount}
            </p>
          {/each}
        {/if}
      </p>
      <div class="outputs">
        {#if machine?.outputs && machine.machineType !== MACHINE_TYPE.OUTLET}
          <p class="muted">OUT</p>
          {#each machine?.outputs as output}
            <p>
              <span style:color="var(--{MATERIAL_TYPE[output.materialType]})"
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

  .tiny {
    font-size: 8px;
  }
</style>
