<script lang="ts">
  import { fade } from "svelte/transition"
  import { MACHINE_TYPE } from "../../../../modules/state/base/enums"
  import type { GraphMachine } from "../types"
  import { CELL_HEIGHT, CELL_WIDTH } from "../constants"
  export let machine: GraphMachine

  $: style = `top: ${CELL_HEIGHT * machine.y}px; left: ${CELL_WIDTH * machine.x}px;`
  $: label = `${MACHINE_TYPE[machine.machineType]} ${machine.buildIndex ?? ""}`

  // console.log("machine", machine)
</script>

<div class="machine" in:fade {style}>{label}</div>

<style lang="scss">
  .machine {
    font-size: 8px;
    width: var(--cellWidth);
    height: var(--cellHeight);
    display: flex;
    justify-content: center;
    align-items: center;
    background: grey;
    position: absolute;
  }
</style>
