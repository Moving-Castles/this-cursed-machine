<script>
  import Force from "./Force/Wrapper.svelte"
  import Materials from "./Materials/Wrapper.svelte"
  import Machines from "./Machines/Wrapper.svelte"
  import MachinesSVG from "./MachinesSVG/Wrapper.svelte"
  export let id = "materials"

  const components = {
    force: Force,
    materials: Materials,
    machines: Machines,
    "machines-svg": MachinesSVG,
  }
</script>

<svelte:component this={components[id]} />
