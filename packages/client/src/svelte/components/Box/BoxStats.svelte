<script lang="ts">
  import { simulated } from "../../modules/simulator"
  import { MachineType, MaterialType } from "../../modules/state/enums"
  import { machines, playerBox, playerCore } from "../../modules/state"
  import { hexToString, stringToHex } from "../../modules/utils/misc"
  export let box: Box

  const getAdjective = (degrees: number) => {
    if (degrees >= 100) return "BOILING"
    else if (degrees >= 50) return "HOT"
    else if (degrees >= 20) return "WARM"
    else if (degrees > 0) return "COLD"
    else return "FROZEN"
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="box-stats">
  <p>
    *** XXXXXXXXXXXXXXXX ***<br />XXX YOUR SKINNER BOX XXX
    <br />*** XXXXXXXXXXXXXXXX ***<br /><br />

    ID (encoded):<br />
    {hexToString($playerCore.carriedBy)}
  </p>

  <p>Contents:</p>
  <!-- {#each Object.entries$simulated as machine (machine.machineId)}
    ---
    <div>
      {#if $machines[machine.machineId]}
        <p>
          {MachineType[$machines[machine.machineId].machineType]}
        </p>
      {/if}
      {machine.amount}
      {getAdjective(machine.temperature)}
      {MaterialType[machine.materialType]}
    </div>
    ---<br />
  {/each} -->

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
</div>

<style>
  .box-stats {
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
  }
  .agreement-button {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
