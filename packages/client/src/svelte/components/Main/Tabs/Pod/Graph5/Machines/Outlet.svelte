<script lang="ts">
  import { fade } from "svelte/transition"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import type { GraphMachine } from "../types"
  import { CELL } from "../constants"
  import { EMPTY_CONNECTION } from "@modules/utils"
  export let machine: GraphMachine

  $: style = `top: ${CELL.HEIGHT * machine.y}px; left: ${CELL.WIDTH * machine.x}px;`
  $: label = `${MACHINE_TYPE[machine.machineType]} ${machine.buildIndex ?? ""}`
  $: connected = machine.depotConnection !== EMPTY_CONNECTION
</script>

<div class="outlet" in:fade class:connected {style}>
  {label}
</div>

<style lang="scss">
  .outlet {
    width: calc(var(--cellWidth) * 5);
    height: calc(var(--cellWidth) * 5);
    font-size: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: black;
    color: white;

    &.connected {
      background: rgb(148, 255, 116);
      color: black;
    }
  }
</style>
