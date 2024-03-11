<script lang="ts">
  import { MACHINE_TYPE } from "@modules/state/base/enums"
  import type { SimulatedMachine } from "@modules/state/simulated/types"
  import { MACHINE_SIZE } from "../constants"
  export let machine: SimulatedMachine

  console.log("machine", machine)
</script>

<rect
  class="node-rect MACHINE_{MACHINE_TYPE[machine.machineType]}"
  x={100 - MACHINE_SIZE / 2}
  y={100 - MACHINE_SIZE / 2}
  width={MACHINE_SIZE}
  height={MACHINE_SIZE}
  stroke-width="2"
  fill="red"
/>

<style lang="scss">
  * {
    transform-box: fill-box;
  }

  .node-rect:not(.INLET):not(.OUTLET):not(.MACHINE_PLAYER).FLOWING,
  .node-image:not(.INLET):not(.OUTLET):not(.MACHINE_PLAYER).FLOWING {
    animation: rotateAnimation 0.1s infinite alternate linear;
  }

  .MACHINE_INLET.FLOWING {
    transform-origin: left; /* or transform-origin: 50% */
    transform-box: fill-box;
    animation:
      pushAnimation 500ms cubic-bezier(0.95, 0.05, 0.795, 0.035),
      pullAnimation 500ms linear 500ms;
  }

  .MACHINE_OUTLET {
    transition: transform 0.2s ease;
  }
  .MACHINE_OUTLET.FLOWING {
    transform-origin: right; /* or transform-origin: 50% */
    transform-box: fill-box;
    transform: scale(1.2, 1);
    animation:
      pullAnimation 500ms cubic-bezier(0.95, 0.05, 0.795, 0.035),
      pushAnimation 500ms linear 500ms;
  }

  .MACHINE_PLAYER.FLOWING {
    animation:
      growAnimation 500ms cubic-bezier(0.95, 0.05, 0.795, 0.035),
      shrinkAnimation 500ms linear 500ms;
  }

  .FLOWING:not(.MACHINE_PLAYER):not(.MACHINE_INLET):not(.MACHINE_OUTLET) {
    animation: rotateAnimation 500ms linear;
  }

  @keyframes pushAnimation {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2, 1);
    }
  }
  @keyframes pullAnimation {
    0% {
      transform: scale(1.2, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  @keyframes growAnimation {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }

  @keyframes shrinkAnimation {
    0% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes rotateAnimation {
    0% {
      transform: rotate(-12deg);
    }
    100% {
      transform: rotate(12deg);
    }
  }

  @keyframes rotateAnimation {
    0% {
      transform: rotate(-12deg);
    }
    100% {
      transform: rotate(12deg);
    }
  }
</style>
