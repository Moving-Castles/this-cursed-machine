<script lang="ts">
  export let machineType // can be numerical or string
  import { MACHINE_LORE } from "../../modules/content/lore"
  // List contents etc

  const machineLore = MACHINE_LORE[machineType]

  console.log(machineLore)
</script>

<div class="machine-information">
  <p>INPUTS:</p>
  <p>
    {machineLore}
  </p>
  <p>OUTPUTS:</p>
</div>

<style>
  .machine-information {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>
