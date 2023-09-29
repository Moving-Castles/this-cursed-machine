<script lang="ts">
  import { symbols, output, index, parsed } from "./index"
  import { evaluate } from "./evaluate"
  import { buildMachine, connectMachines, availablePorts } from "./actions"
  import {
    potential,
    simulatedMachines,
    simulatedPorts,
    simulatedConnections,
  } from "../../modules/simulator"
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte"
  import { playSound } from "../../modules/sound"
  import { onWheel } from "../../modules/ui/events"
  import { lastSentTime } from "../../modules/ui/stores"
  import { v4 as uuid } from "uuid"
  import Select from "./Select.svelte"
  import MultiSelect from "./MultiSelect.svelte"
  import { EntityType, MachineType } from "../../modules/state/enums"
  export let speed = 80
  export let theme = "dark"
  export let placeholder = "Start typing"
  export let loop = false
  export let track = true
  export let input = false
  export let stage = true // display the terminal centered and front stage
  export let animated = false
  let machinesToConnect = {}

  /** Constants */
  const dispatch = createEventDispatcher()
  const AVAILABLE_MACHINES = Object.values(MachineType).splice(
    0,
    Object.keys(MachineType).length / 2
  )

  /** Variables */
  let inputElement: HTMLElement
  let outputElement: HTMLElement
  let userInput = ""
  let selectedAction = ""
  let skip = false

  /**
   * Send stuff to the terminal
   */
  export async function send(string: string, user = false) {
    // Send the actual string
    output.set([...$output, `${user ? `${symbols[2]} ` : ""}${string}`])

    lastSentTime.set(performance.now())

    await tick()

    dispatch("send", string)

    if (outputElement) {
      outputElement.scrollTop = outputElement.scrollTop + 10000
    }

    const action = evaluate(string, dispatch, send)

    console.log(action)

    if (action) {
      selectedAction = action
    }
  }

  const clearPotential = () => {
    selectedAction = ""
    userInput = ""
    potential.set({})
  }

  const displayMachinePotential = ({ detail }) => {
    potential.set({
      [uuid()]: {
        machineType: MachineType[detail],
        entityType: EntityType.MACHINE,
        potential: true,
      },
    })
  }

  const displayConnectionPotential = ({ detail }) => {
    const [occupiedFrom, availableFrom] = availablePorts(detail[0])
    const [occupiedTo, availableTo] = availablePorts(detail[0])

    if (availableFrom.length > 0 && availableTo.length > 0) {
      potential.set({
        [uuid()]: {
          entityType: EntityType.CONNECTION,
          sourcePort: availableFrom[0][0],
          targetPort: availableTo[0][0],
          potential: true,
        },
      })
    }
  }

  const onBuildConfirm = ({ detail }) => {
    selectedAction = ""
    buildMachine(detail, send)
    userInput = ""
  }

  const onConnectConfirm = ({ detail }) => {
    connectMachines(detail[0], detail[1], send)
    selectedAction = "connect"
    userInput = ""
  }

  const onAdvance = ({ detail }) => {
    send("Connecting: " + detail)
  }

  /** The submit function */
  const onSubmit = async () => {
    if (userInput === "") return
    send(userInput, true)
    playSound("ui", "selectFour")
    userInput = ""
  }

  const filterByAvailablePorts = ([machineId, _]) => {
    // Get machine associated ports
    const machinePorts = Object.entries($simulatedPorts).filter(
      ([_, port]) => port.carriedBy === machineId
    )

    const occupiedPorts = machinePorts.filter(([id, _]) => {
      return Object.values($simulatedConnections).find(
        connection =>
          connection.sourcePort === id || connection.targetPort === id
      )
    })

    return machinePorts.length - occupiedPorts.length > 0
  }

  /** Reactive statements */
  // Key for transitions
  $: key = $index + (skip ? "-skip" : "")
  $: {
    machinesToConnect = Object.fromEntries(
      Object.entries($simulatedMachines).filter(filterByAvailablePorts)
    )
  }

  /** Lifecycle hooks */
  onMount(() => {
    inputElement?.focus()
    $index = 0
  })

  onDestroy(() => index.set(-1))
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={outputElement}
  on:click={() => inputElement?.focus()}
  use:onWheel
  class="terminal"
  class:stage
>
  {#if !input}
    {#each $output as o, i (i + key)}
      <p class="output-content">
        {@html parsed(o)}
      </p>
    {/each}
  {/if}

  <form class="terminal-input" on:submit|preventDefault={onSubmit}>
    {#if selectedAction === "build"}
      <Select
        options={AVAILABLE_MACHINES}
        bind:value={userInput}
        on:confirm={onBuildConfirm}
        on:change={displayMachinePotential}
        on:cancel={clearPotential}
      />
    {:else if selectedAction === "connect"}
      <MultiSelect
        options={[
          Object.values(machinesToConnect).map(
            machine =>
              `${MachineType[machine.machineType]}: ${machine.numericalID}`
          ),
          Object.values(machinesToConnect).map(
            machine =>
              `${MachineType[machine.machineType]}: ${machine.numericalID}`
          ),
        ]}
        on:change={displayConnectionPotential}
        on:advance={onAdvance}
        on:confirm={onConnectConfirm}
      />
    {:else}
      {#if !input}
        <span class="player-stats">
          {symbols[0]}
        </span>
      {/if}
      <input
        type="text"
        {placeholder}
        bind:this={inputElement}
        bind:value={userInput}
      />
    {/if}
  </form>
</div>

<style lang="scss">
  .terminal {
    font-family: var(--font-family);
    padding: 8px;
    overflow: hidden;
    transition: background 2s ease, color 2s ease;
    color: var(--terminal-color);
    background: var(--terminal-background);
    width: 100%;
    position: relative;
    height: 100vh;
    white-space: pre-line;
    outline: var(--terminal-border);
    outline-offset: -8px;

    &.stage {
      position: fixed;
      left: 0;
      top: 0;
      width: 400px;
    }

    .track {
      position: absolute;
      right: 1rem;
      pointer-events: none;
    }

    :global(*) {
      &::selection {
        background: var(--terminal-color);
        color: var(--terminal-background);
      }
    }

    .terminal-output {
      // height: calc(100% - 1.5rem);
      white-space: pre-wrap;
      overflow: hidden;
      line-height: 1.5rem;
    }
    .terminal-input {
      background: var(--terminal-background);
      color: var(--terminal-color);
      font-family: var(--font-family);
      height: 3rem;
      // padding: 0;
      line-height: 2rem;
      font-size: 1rem;
      border: none;
      outline: none;
      // position: absolute;
      // bottom: 0;
      left: 1.5rem;
      height: 1.5rem;
      transition: background 2s ease, color 2s ease;
      display: flex;
      // z-index: 999;

      .player-stats {
        white-space: nowrap;
        vertical-align: middle;
        line-height: 1.5rem;
      }

      input {
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        line-height: inherit;
        width: 60ch;
        max-width: 100%;
        background-color: inherit;
        border: none;
        padding: 0 1ch;

        &:focus {
          border: none;
          outline: none;
        }
      }
    }
  }

  .output-content {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>
