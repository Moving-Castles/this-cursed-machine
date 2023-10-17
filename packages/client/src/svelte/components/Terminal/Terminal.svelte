<script lang="ts">
  import { symbols, output, index, parsed } from "./index"
  import { evaluate } from "./evaluate"
  import {
    buildMachine,
    connectMachines,
    disconnectMachines,
    destroyMachine,
  } from "./actions"
  import { machinePorts as availablePorts } from "../../modules/state/convenience"
  import type { Action } from "../../modules/action/actionSequencer"
  import {
    completedActions,
    failedActions,
    watchingAction,
  } from "../../modules/action/actionSequencer"
  import {
    AVAILABLE_MACHINES,
    potential,
    simulatedMachines,
    simulatedPorts,
    simulatedConnections,
    readableConnections,
    readableMachines,
  } from "../../modules/simulator"
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte"
  import { playSound } from "../../modules/sound"
  import { onWheel } from "../../modules/ui/events"
  import { lastSentTime } from "../../modules/ui/stores"
  import { v4 as uuid } from "uuid"
  import Select from "./Select.svelte"
  import MultiSelect from "./MultiSelect.svelte"
  import BouncingSuffer from "../Loading/BouncingSuffer.svelte"
  import { playerCore } from "../../modules/state"
  import { EntityType, MachineType } from "../../modules/state/enums"

  export let speed = 80
  export let theme = "dark"
  export let placeholder = "Start typing"
  export let loop = false
  export let track = true
  export let input = false
  export let stage = false // display the terminal centered and front stage
  export let animated = false

  let machinesToConnect = {}

  /** Constants */
  const dispatch = createEventDispatcher()

  /** Variables */
  let inputElement: HTMLElement
  let outputElement: HTMLElement
  let userInput = ""
  let selectedAction = ""
  let skip = false
  let connectMachinesOptions: Record<string, any>[][] = []

  // If defined, sort by creation first
  const creationBlockSort = (a, b) => {
    if (
      typeof a?.creationBlock === "bigint" &&
      typeof b?.creationBlock === "bigint"
    ) {
      return b?.creationBlock - a?.creationBlock
    } else {
      return 1
    }
  }

  $: {
    // The sorting for connect is 1. inlet 2. outlet and then the rest of the components
    const fromOptions = Object.entries(machinesToConnect)
      .sort(creationBlockSort)
      .map(([id, machine]) => ({
        id,
        machine,
        text: MachineType[machine.machineType],
      }))
    const toOptions = Object.entries(machinesToConnect)
      .sort(creationBlockSort)
      .map(([id, machine]) => ({
        id,
        machine,
        text: MachineType[machine.machineType],
      }))
    connectMachinesOptions = [fromOptions, toOptions]
  }

  // States for actions are queued, active, completed or failed
  // This block updates the UI when an action is triggered
  $: {
    if ($watchingAction) {
      // Select processing as the action to block the input
      selectedAction = "processing"
      // Now keep an eye on where that action goes.
      const completed = $completedActions.find(
        (action: Action) => action.actionId === $watchingAction.actionId
      )
      const failed = $failedActions.find(
        (action: Action) => action.actionId === $watchingAction.actionId
      )

      if (completed || failed) {
        watchingAction.set(null)
        selectedAction = ""
        clearPotential()
        scrollToEnd()
      }
    }
  }

  $: {
    if ($watchingAction === null) {
      clearPotential()
      scrollToEnd()
    }
  }

  $: if (selectedAction) scrollToEnd()

  // Key for transitions
  $: key = $index + (skip ? "-skip" : "")

  $: {
    machinesToConnect = Object.fromEntries(
      Object.entries($simulatedMachines).filter(filterByAvailablePorts)
    )
  }

  /**
   * Send stuff to the terminal
   */
  export async function send(string: string, user = false) {
    // Send the actual string
    output.set([...$output, `${user ? `${symbols[2]} ` : ""}${string}`])

    lastSentTime.set(performance.now())

    await tick()

    dispatch("send", string)

    const action = evaluate(string, dispatch, send)

    if (action) {
      selectedAction = action
    }

    scrollToEnd()
  }

  async function scrollToEnd() {
    if (outputElement) {
      await tick()
      outputElement.scrollTop = outputElement.scrollTop + 10000
    }
  }

  const clearPotential = async () => {
    selectedAction = ""
    userInput = ""
    potential.set({})
    await tick()
    inputElement?.focus()
  }

  const displayMachinePotential = ({ detail }) => {
    potential.set({
      [uuid()]: {
        machineType: MachineType[detail],
        entityType: EntityType.MACHINE,
        potential: true,
        carriedBy: $playerCore.carriedBy,
      },
    })
  }

  const displayConnectionPotential = ({ detail }) => {
    const [_, availableFrom] = availablePorts(detail[0])
    const [__, availableTo] = availablePorts(detail[0])

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
    $watchingAction = buildMachine(detail, send)
    // console.log($watchingAction)
    userInput = ""
  }

  const onConnectConfirm = ({ detail }) => {
    $watchingAction = connectMachines(detail[0].id, detail[1].id, send)
    // console.log($watchingAction)
    userInput = ""
  }

  const onDisconnectConfirm = ({ detail }) => {
    const connection = $readableConnections.find(con => con.read === detail)
    if (connection) {
      $watchingAction = disconnectMachines(connection.id)
    }
  }

  const onDestroyConfirm = ({ detail }) => {
    const machine = $readableMachines.find(mac => mac.read === detail)
    if (machine) {
      $watchingAction = destroyMachine(machine.id)
    }
  }

  const onAdvance = ({ detail }) => {
    send("Connecting: " + detail.text)
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

  <form
    class:tool-active={selectedAction !== ""}
    class="terminal-input"
    on:submit|preventDefault={onSubmit}
  >
    {#if !$watchingAction}
      {#if selectedAction === "build"}
        <Select
          options={AVAILABLE_MACHINES}
          bind:value={userInput}
          on:confirm={onBuildConfirm}
          on:change={displayMachinePotential}
          on:cancel={clearPotential}
        />
      {:else if selectedAction === "destroy"}
        <Select
          options={$readableMachines
            .filter(({ machine: mac }) => {
              return (
                mac.machineType !== MachineType.CORE &&
                mac.machineType !== MachineType.INLET &&
                mac.machineType !== MachineType.OUTLET
              )
            })
            .map(r => r.read)}
          on:confirm={onDestroyConfirm}
          on:cancel={clearPotential}
        />
      {:else if selectedAction === "disconnect"}
        <Select
          options={$readableConnections.map(r => r.read)}
          on:confirm={onDisconnectConfirm}
          on:cancel={clearPotential}
        />
      {:else if selectedAction === "connect"}
        <MultiSelect
          options={connectMachinesOptions}
          on:change={displayConnectionPotential}
          on:advance={onAdvance}
          on:confirm={onConnectConfirm}
          on:cancel={clearPotential}
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
    {:else}
      <BouncingSuffer />
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

      &.tool-active {
        height: auto;
      }

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
