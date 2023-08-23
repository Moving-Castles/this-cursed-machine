<script lang="ts">
  import {
    MachineType,
    PortPlacement,
    PortType,
  } from "../../modules/state/enums"
  import {
    playerEntityId,
    machines,
    ports,
    connections,
  } from "../../modules/state"
  import { flip } from "svelte/animate"
  import Connection from "../Map/Connection.svelte"

  import "leader-line"

  let pathOptions = ["straight", "arc", "fluid", "magnet", "grid"]

  let w = 0
  let h = 0
  let j = 0
  let pathOptionsIndex = pathOptions.length - 1
  let randomised = false

  let leaderLineConnection = "grid"

  const randomizePos = ({ key }) => {
    if (key === "c") {
      transforms = Object.fromEntries(
        Object.entries($machines).map(([_, __]) => [
          _,
          {
            x: Math.floor(Math.random() * (w - 120)) - (w - 120) / 2,
            y: Math.floor(Math.random() * (h - 120)) - (h - 120) / 2,
          },
        ])
      )
      randomised = true
      j++
    } else if (key === "t") {
      leaderLineConnection =
        pathOptions[pathOptionsIndex++ % pathOptions.length]
      j++
    }
  }

  const machinePorts = address =>
    Object.entries($ports).filter(([add, port]) => port.carriedBy === address)

  let transforms = Object.fromEntries(
    Object.entries($machines).map(([_, __]) => [_, { x: 0, y: 0 }])
  )
</script>

<svelte:window
  bind:innerWidth={w}
  bind:innerHeight={h}
  on:keypress={randomizePos}
/>

<div class="controls">(c) Change perspective (t) [{leaderLineConnection}]</div>

<div class="chart">
  {#each Object.entries($machines) as [address, machine], i (address)}
    <div
      class="machine"
      class:absolute={randomised}
      animate:flip
      style:transform={`translate(${transforms[address].x}px, ${transforms[address].y}px)`}
    >
      <span>
        {MachineType[machine.machineType]}<br />
        {$playerEntityId === address ? "-YOU" : ""}
      </span>

      <div class="ports-top">
        {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.TOP) as [address, p] (p)}
          <div
            class="port port-{address} {MachineType[
              machine.machineType
            ]} {PortType[p.portType]}"
          >
            {PortType[p.portType][0]}
            <!--: {address[2]}{address[3]}{address[4]} -->
          </div>
        {/each}
      </div>

      <div class="ports-left">
        {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.LEFT) as [address, p] (p)}
          <div
            class="port port-{address} {MachineType[
              machine.machineType
            ]} {PortType[p.portType]}"
          >
            {PortType[p.portType][0]}
            <!--: {address[2]}{address[3]}{address[4]} -->
          </div>
        {/each}
      </div>

      <div class="ports-bottom">
        {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.BOTTOM) as [address, p] (p)}
          <div
            class="port port-{address} {MachineType[
              machine.machineType
            ]} {PortType[p.portType]}"
          >
            {PortType[p.portType][0]}
            <!--: {address[2]}{address[3]}{address[4]} -->
          </div>
        {/each}
      </div>

      <div class="ports-right">
        {#each machinePorts(address).filter(([_, p]) => p.portPlacement === PortPlacement.RIGHT) as [address, p] (p)}
          <div
            class="port port-{address} {MachineType[
              machine.machineType
            ]} {PortType[p.portType]}"
          >
            {PortType[p.portType][0]}
            <!--: {address[2]}{address[3]}{address[4]} -->
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

{#each Object.entries($connections) as [_, connection], i (`${_}-${Object.keys($machines).length}-${j}`)}
  <Connection {connection} options={{ path: leaderLineConnection }} />
{/each}

<style lang="scss">
  .controls {
    position: fixed;
    bottom: 0;
    padding: 2rem;
    z-index: 9999;
    font-family: monospace;
    color: var(--terminal-color);
  }
  .chart {
    display: flex;
    gap: 2rem;
    font-family: monospace;
    color: var(--terminal-color);
    overflow: hidden;
  }
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
