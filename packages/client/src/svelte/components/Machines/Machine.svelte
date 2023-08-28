<script lang="ts">
  export let address: string
  export let machine: Entity | Machine
  export let absolute = false
  export let offset = { x: 0, y: 0 }
  import {
    MachineType,
    PortPlacement,
    PortType,
  } from "../../modules/state/enums"
  import { ports, playerEntityId } from "../../modules/state"

  const machinePorts = address =>
    Object.entries($ports).filter(([add, port]) => port.carriedBy === address)
</script>

<div
  class="machine"
  class:absolute
  style:transform={`translate(${offset.x}px, ${offset.y}px)`}
>
  <span>
    {MachineType[machine.machineType]}<br />
    {$playerEntityId === address ? "-YOU" : ""}
  </span>

  <div class="ports-top">
    {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.TOP) as [a, p] (a)}
      <div
        class="port port-{a} {MachineType[machine.machineType]} {PortType[
          p.portType
        ]}"
      >
        {PortType[p.portType][0]}
      </div>
    {/each}
  </div>

  <div class="ports-left">
    {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.LEFT) as [a, p] (a)}
      <div
        class="port port-{a} {MachineType[machine.machineType]} {PortType[
          p.portType
        ]}"
      >
        {PortType[p.portType][0]}
      </div>
    {/each}
  </div>

  <div class="ports-bottom">
    {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.BOTTOM) as [a, p] (a)}
      <div
        class="port port-{a} {MachineType[machine.machineType]} {PortType[
          p.portType
        ]}"
      >
        {PortType[p.portType][0]}
      </div>
    {/each}
  </div>

  <div class="ports-right">
    {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.RIGHT) as [a, p] (a)}
      <div
        class="port port-{a} {MachineType[machine.machineType]} {PortType[
          p.portType
        ]}"
      >
        {PortType[p.portType][0]}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .machine {
    width: 120px;
    height: 120px;
    border: 1px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: transparent;

    &.absolute {
      position: absolute;
    }
  }

  .ports-left {
    position: absolute;
    left: 0;
    height: 100%;
    width: 10px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: end;
    gap: 4px;
    z-index: 999;
  }
  .ports-right {
    position: absolute;
    right: 0;
    height: 100%;
    width: 10px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: start;
    gap: 4px;
    z-index: 999;
  }

  .ports-top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: start;
    gap: 4px;
    z-index: 999;
  }

  .ports-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: end;
    gap: 4px;
    z-index: 999;
  }
</style>
