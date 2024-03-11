<script lang="ts">
  import { fade } from "svelte/transition"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import type { GraphMachine } from "../types"
  import { CELL } from "../constants"
  export let machine: GraphMachine

  $: style = `top: ${CELL.HEIGHT * machine.y}px; left: ${CELL.WIDTH * machine.x}px;`
  $: label = `${MACHINE_TYPE[machine.machineType]} ${machine.buildIndex ?? ""}`
</script>

<div class="player" in:fade {style}>
  {label}
</div>

<style lang="scss">
  .player {
    width: calc(var(--cellWidth) * 13);
    height: calc(var(--cellWidth) * 13);
    font-size: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-image: url("/images/eye.png");
    background-size: cover;
    border: 1px solid black;
  }
</style>
