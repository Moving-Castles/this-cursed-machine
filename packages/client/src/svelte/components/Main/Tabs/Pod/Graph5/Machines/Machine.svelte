<script lang="ts">
  import { fade } from "svelte/transition"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import type { GraphMachine } from "../types"
  import { CELL } from "../constants"
  export let machine: GraphMachine

  $: style = `top: ${CELL.HEIGHT * machine.y}px; left: ${CELL.WIDTH * machine.x}px;`
  $: label = `${MACHINE_TYPE[machine.machineType]} ${machine.buildIndex ?? ""}`
</script>

<div class="machine {MACHINE_TYPE[machine.machineType]}" in:fade {style}>
  {label}
</div>

<style lang="scss">
  .machine {
    width: calc(var(--cellWidth) * 7);
    height: calc(var(--cellWidth) * 7);
    font-size: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: darkgrey;
    position: absolute;
  }
</style>
