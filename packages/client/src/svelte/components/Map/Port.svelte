<script lang="ts">
  import "leader-line"
  import { PortType } from "../../modules/state/enums"
  import { onPortClick } from "../../modules/ui/events"
  export let address: string
  export let port: Port
</script>

<div
  class="port port-{address}"
  on:click={() => onPortClick(address, port)}
  class:in={port.portType === PortType.INPUT}
  class:out={port.portType === PortType.OUTPUT}
/>

<style lang="scss">
  .port {
    width: 8px;
    height: 20px;
    background: white;

    &:hover {
      transform: scale(2);
    }

    &.in {
      border: 1px solid red;
    }

    &.out {
      border: 1px solid blue;
    }
  }
</style>
