<script>
  import { inspecting } from "./index"
  import Force from "./Force/Wrapper.svelte"
  import Materials from "./Materials/Wrapper.svelte"
  import Machines from "./Machines/Wrapper.svelte"
  import MachinesSVG from "./MachinesSVG/Wrapper.svelte"
  import MachineInformation from "../Machines/MachineInformation.svelte"

  export let id = "materials"

  $: console.log($inspecting)

  let machineType = null

  const components = {
    force: Force,
    materials: Materials,
    machines: Machines,
    "machines-svg": MachinesSVG,
  }
</script>

{#if $inspecting !== null}
  <MachineInformation machineType={$inspecting} />
{/if}

<MachinesSVG />