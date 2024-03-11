<script lang="ts">
  import { fade } from "svelte/transition"
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import type { GraphMachine } from "../types"
  export let machine: GraphMachine

  console.log("machine", machine)

  $: style = `top: ${machine.elkNode.y}px; left: ${machine.elkNode.x}px;`
  $: label = `${MACHINE_TYPE[machine.machineType]} ${machine.buildIndex ?? ""}`
</script>

<div class="machine {MACHINE_TYPE[machine.machineType]}" in:fade {style}>
  {label}
</div>

<style lang="scss">
  .machine {
    font-size: 8px;
    width: 100px;
    height: 100px;
    // width: var(--cellWidth);
    // height: var(--cellHeight);
    display: flex;
    justify-content: center;
    align-items: center;
    // background: grey;
    border: 1px solid black;
    position: absolute;

    &.INLET,
    &.OUTLET {
      background: black;
      color: white;
      border-radius: 50%;
    }

    &.PLAYER {
      border-radius: 20%;
      // background-image: url("/images/body.jpg");
      // background-size: cover;
    }
  }
</style>
