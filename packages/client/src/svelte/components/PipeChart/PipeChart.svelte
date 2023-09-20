<script lang="ts">
  import {
    MachineType,
    PortPlacement,
    PortType,
  } from "../../modules/state/enums"
  import { machines, ports, connections } from "../../modules/state"
  import { flip } from "svelte/animate"
  import Connection from "../Map/Connection.svelte"
  import "leader-line"
  export let vertical = false
  export let controls = false

  let pathOptions = ["straight", "arc", "fluid", "magnet", "grid"]

  // let w = 0
  // let h = 0
  let j = 0
  let pathOptionsIndex = pathOptions.length - 1
  // let randomised = false

  let leaderLineConnection = "grid"
</script>

<div class="chart" class:vertical>
  <p>PIPES</p>
  <p class="pipes">
    {#each Object.entries($connections) as [_, connection], i (`${_}-${$machines.length}-${j}`)}
      <div class="pipe">
        <div class="pipe-from port-{connection.sourcePort}">
          {MachineType[
            $machines[$ports[connection.sourcePort].carriedBy].machineType
          ]}
        </div>
        <div class="pipe-to port-{connection.targetPort}">
          {MachineType[
            $machines[$ports[connection.targetPort].carriedBy].machineType
          ]}
        </div>
      </div>
    {/each}
  </p>
</div>

{#each Object.entries($connections) as [_, connection], i (`${_}-${$machines.length}-${j}`)}
  <Connection {connection} options={{ path: leaderLineConnection }} />
{/each}

<style lang="scss">
  .controls {
    position: fixed;
    bottom: 0;
    padding: 2rem;
    z-index: 9999;
    font-family: var(--font-family);
    color: var(--terminal-color);
  }
  .chart {
    display: flex;
    gap: 2rem;
    font-family: var(--font-family);
    color: var(--terminal-color);
    overflow: hidden;
    height: 100%;
    width: 100%;

    .pipes {
      width: 100%;
      word-wrap: break-word;

      .pipe {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
    }

    &.vertical {
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
    }
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
