<script lang="ts">
  import { PortType } from "../../modules/state/enums"
  export let port: Port
</script>

<div
  class="port"
  class:in={port.portType === PortType.INPUT}
  class:out={port.portType === PortType.OUTPUT}
/>

<style lang="scss">
  .port {
    width: 8px;
    height: 20px;
    background: white;

    &.in {
      border: 1px solid red;
    }

    &.out {
      border: 1px solid blue;
    }
  }
</style>
