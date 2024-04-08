<script lang="ts">
  import type { GraphMachine } from "../types"
  import { MACHINE_TYPE } from "contracts/enums"

  import Inlet from "./Inlet.svelte"
  import Outlet from "./Outlet.svelte"
  import Player from "./Player.svelte"
  import Machine from "./Machine.svelte"

  export let i = 0
  export let address: string
  export let machine: GraphMachine

  const componentList = {
    [MACHINE_TYPE.NONE]: Machine,
    [MACHINE_TYPE.INLET]: Inlet,
    [MACHINE_TYPE.OUTLET]: Outlet,
    [MACHINE_TYPE.PLAYER]: Player,
    [MACHINE_TYPE.SPLITTER]: Machine,
    [MACHINE_TYPE.MIXER]: Machine,
    [MACHINE_TYPE.DRYER]: Machine,
    [MACHINE_TYPE.BOILER]: Machine,
    [MACHINE_TYPE.CENTRIFUGE]: Machine,
    [MACHINE_TYPE.GRINDER]: Machine,
    [MACHINE_TYPE.RAT_CAGE]: Machine,
    [MACHINE_TYPE.MEALWORM_VAT]: Machine,
  }

  const component = componentList[machine.machineType]
</script>

<svelte:component this={component} {address} {machine} />
