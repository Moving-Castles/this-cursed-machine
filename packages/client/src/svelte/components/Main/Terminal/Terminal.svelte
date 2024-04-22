<script lang="ts">
  import { EMPTY_CONNECTION } from "@modules/utils/constants"
  import { activeTab, selectedParameters } from "@modules/ui/stores"
  import { get } from "svelte/store"
  import { tick, createEventDispatcher, onMount, onDestroy } from "svelte"
  import type { Command, SelectOption } from "@components/Main/Terminal/types"
  import {
    TERMINAL_TYPE,
    DIRECTION,
    TERMINAL_OUTPUT_TYPE,
    COMMAND,
  } from "@components/Main/Terminal/enums"

  import {
    SYMBOLS,
    NO_INPUT_COMMANDS,
    SINGLE_INPUT_COMMANDS,
  } from "@components/Main/Terminal"
  import { terminalOutput } from "@components/Main/Terminal/stores"
  import { evaluate } from "@components/Main/Terminal/functions/evaluate"
  import { playInputSound } from "@components/Main/Terminal/functions/sound"
  import {
    MACHINE_TYPE,
    PORT_INDEX,
    MATERIAL_TYPE,
  } from "@modules/state/base/enums"
  import { writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
  import { createSelectOptions } from "@components/Main/Terminal/functions/selectOptions"
  import Select from "@components/Main/Terminal/Select.svelte"

  import { scrollToEnd } from "@components/Main/Terminal/functions/helpers"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import { renderSelect } from "@components/Main/Terminal/functions/renderSelect"
  import { machineTypeToLabel, availablePorts } from "@modules/state/simulated"
  import {
    playerPod,
    machines as machinesStore,
  } from "@modules/state/base/stores"
  import { terminalMessages } from "./functions/terminalMessages"
  import { playSound } from "@modules/sound"

  import TerminalOutput from "@components/Main/Terminal/TerminalOutput.svelte"
  import TerminalInput from "@components/Main/Terminal/TerminalInput.svelte"

  export let terminalType: TERMINAL_TYPE = TERMINAL_TYPE.FULL
  export let placeholder = "HELP"
  export let setBlink = false
  export let noOutput = false

  let inputElement: HTMLInputElement
  let value = ""
  let customInputContainerElement: HTMLDivElement
  let interval: ReturnType<typeof setInterval>
  let inputActive = false
  let hasFocus = false

  const dispatch = createEventDispatcher()

  const focusInput = async (e?: any) => {
    // console.log(inputElement)
    if (inputElement) {
      inputElement?.focus()
    }
  }

  export const resetInput = async () => {
    selectedParameters.set([])
    value = ""
    inputActive = true
    scrollToEnd()
    focusInput()
  }

  const handleInvalid = async (message: string) => {
    playSound("tcm", "typingEnter")
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.ERROR,
      message,
      false,
      SYMBOLS[5],
    )
    resetInput()
  }

  const executeCommand = async (command: Command, parameters: any[]) => {
    // Execute function
    await command.fn(...parameters)
    // Note: It is the parent's responsibility to reset the input on this event
    dispatch("commandExecuted", { command, parameters })
  }

  const getConfirmation = async command => {
    const selectOptions = createSelectOptions(command.id)

    // Abort if no options
    if (selectOptions.length === 0) {
      await handleInvalid("Nothing")
      return false
    }

    const value = await renderSelect(
      customInputContainerElement,
      Select,
      selectOptions,
    )

    // Abort if nothing selected
    if (!value) {
      await handleInvalid("Nothing selected")
      return false
    }

    return [value]
  }

  const getSingleInputCommandParameters = async (
    command: Command,
  ): Promise<any[] | false> => {
    const selectOptions = createSelectOptions(command.id)

    // Abort if no options
    if (selectOptions.length === 0) {
      await handleInvalid("Nothing")
      return false
    }

    const value = await renderSelect(
      customInputContainerElement,
      Select,
      selectOptions,
    )

    // Abort if nothing selected
    if (!value) {
      await handleInvalid("Nothing selected")
      return false
    }

    return [value]
  }

  const getDisconnectParameters = async (): Promise<any[] | false> => {
    let disconnectOptions = createSelectOptions(COMMAND.DISCONNECT)

    // Abort if no options
    if (disconnectOptions.length === 0) {
      await handleInvalid("Nothing to disconnect")
      return false
    }

    const connectionId = await renderSelect(
      customInputContainerElement,
      Select,
      disconnectOptions,
    )

    // Abort if nothing selected
    if (
      !connectionId ||
      !$simulatedConnections.find(c => c.id === connectionId)
    ) {
      handleInvalid("No connection")
      return false
    }

    const connection = $simulatedConnections.find(c => c.id === connectionId)

    return [connection?.sourceMachine, connection?.portIndex.source]
  }

  const getConnectParameters = async (): Promise<any[] | false> => {
    selectedParameters.set([])

    // %%%%%%%%%%%%%%%%%%%%%%%%%%
    // %% Start source machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%

    // Get machines with available outgoing connection slots
    let sourceSelectOptions = createSelectOptions(
      COMMAND.CONNECT,
      DIRECTION.OUTGOING,
    )

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.INFO, "From:")

    const sourceMachineKey = await renderSelect(
      customInputContainerElement,
      Select,
      sourceSelectOptions,
    )
    selectedParameters.set([sourceMachineKey])

    // Abort if nothing selected
    if (!sourceMachineKey) {
      handleInvalid("No source machine")
      return false
    }

    let sourceMachineEntity = $simulatedMachines[sourceMachineKey]

    const sourceMachineLabel =
      "From: " +
      machineTypeToLabel(sourceMachineEntity.machineType) +
      (sourceMachineEntity.buildIndex !== undefined
        ? " #" + sourceMachineEntity.buildIndex
        : "")

    writeToTerminal(
      TERMINAL_OUTPUT_TYPE.INFO,
      sourceMachineLabel,
      true,
      SYMBOLS[11],
    )

    // %%%%%%%%%%%%%%%%%%%%%%%%
    // %% End source machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%

    // %%%%%%%%%%%%%%%%%%%%%%%%%%
    // %% Start port selection %%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%

    // Default, for all machines that only have one port
    let portIndex = PORT_INDEX.FIRST

    // Handle splitter port selection
    if (sourceMachineEntity.machineType === MACHINE_TYPE.SPLITTER) {
      const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)
      // Use the first available
      portIndex = ports[0].portIndex
    } else if (
      sourceMachineEntity.machineType === MACHINE_TYPE.CENTRIFUGE ||
      sourceMachineEntity.machineType === MACHINE_TYPE.GRINDER ||
      sourceMachineEntity.machineType === MACHINE_TYPE.RAT_CAGE ||
      sourceMachineEntity.machineType === MACHINE_TYPE.MEALWORM_VAT
    ) {
      await writeToTerminal(TERMINAL_OUTPUT_TYPE.INFO, "Select source port:")
      let sourcePortOptions: SelectOption[] = []

      const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)
      // console.log(ports)

      const portLabel = (p: any) => {
        const product = sourceMachineEntity?.products?.[p.portIndex]

        if (!product) return `Port #${p.portIndex + 1}`

        return `Port #${p.portIndex + 1} (${MATERIAL_TYPE[product?.materialType]})`
      }

      sourcePortOptions = ports.map(p => ({
        label: portLabel(p),
        value: p.portIndex,
        available:
          p.machine.outgoingConnections[p.portIndex] === EMPTY_CONNECTION,
      }))

      const sourcePort = (await renderSelect(
        customInputContainerElement,
        Select,
        sourcePortOptions,
      )) as PORT_INDEX

      // Abort if nothing selected
      if (!sourcePort && sourcePort !== 0) {
        handleInvalid("No port selected")
        return false
      }

      await writeToTerminal(
        TERMINAL_OUTPUT_TYPE.NORMAL,
        "Port: #" + (sourcePort + 1),
        true,
        SYMBOLS[14],
      )

      portIndex = sourcePort
      selectedParameters.set([sourceMachineKey, portIndex])
    } else if (sourceMachineEntity.machineType === MACHINE_TYPE.PLAYER) {
      await writeToTerminal(TERMINAL_OUTPUT_TYPE.INFO, "Select source port:")
      let sourcePortOptions: SelectOption[] = []

      const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)

      const portLabel = (p: any) => {
        const product = sourceMachineEntity?.products?.[p.portIndex]

        if (!product) return `Port #${p.portIndex + 1}`

        return `Port #${p.portIndex + 1} (${MATERIAL_TYPE[product?.materialType]})`
      }

      sourcePortOptions = ports.map(p => ({
        label: portLabel(p),
        value: p.portIndex,
        available:
          p.machine.outgoingConnections[p.portIndex] === EMPTY_CONNECTION,
      }))

      const sourcePort = (await renderSelect(
        customInputContainerElement,
        Select,
        sourcePortOptions,
      )) as PORT_INDEX

      // Abort if nothing selected
      if (!sourcePort && sourcePort !== 0) {
        handleInvalid("No port selected")
        return false
      }

      await writeToTerminal(
        TERMINAL_OUTPUT_TYPE.NORMAL,
        "Port: #" + (sourcePort + 1),
        true,
        SYMBOLS[14],
      )

      portIndex = sourcePort
      selectedParameters.set([sourceMachineKey, portIndex])
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%
    // %% End port selection %%
    // %%%%%%%%%%%%%%%%%%%%%%%%

    // %%%%%%%%%%%%%%%%%%%%%%%%%%
    // %% Start target machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%

    // Get machines with available incoming connection slots
    // Remove the source machine from the list
    let targetSelectOptions = createSelectOptions(
      COMMAND.CONNECT,
      DIRECTION.INCOMING,
    ).filter(option => option.value !== sourceMachineKey)

    // Abort if no available targets
    if (targetSelectOptions.length === 0) {
      handleInvalid("No machines available")
      return false
    }

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.INFO, "TO:")

    let targetMachineKey = await renderSelect(
      customInputContainerElement,
      Select,
      targetSelectOptions,
    )

    // Abort if nothing selected
    if (!targetMachineKey) {
      handleInvalid("No target machine")
      return false
    }

    let targetMachineEntity = $simulatedMachines[targetMachineKey]

    const targetMachineLabel =
      "To: " +
      machineTypeToLabel(targetMachineEntity.machineType) +
      (targetMachineEntity.buildIndex !== undefined
        ? " #" + targetMachineEntity.buildIndex
        : "")

    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.INFO,
      targetMachineLabel,
      true,
      SYMBOLS[14],
    )

    // %%%%%%%%%%%%%%%%%%%%%%%%
    // %% End target machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%

    selectedParameters.set([sourceMachineKey, portIndex, targetMachineKey])
    return [sourceMachineKey, targetMachineKey, portIndex]
  }

  const getAttachTankParameters = async (): Promise<any[] | false> => {
    // Get tanks
    let sourceSelectOptions = createSelectOptions(COMMAND.PLUG_TANK)

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.INFO, "Tank:")

    const tankEntity = await renderSelect(
      customInputContainerElement,
      Select,
      sourceSelectOptions,
    )

    // Abort if nothing selected
    if (!tankEntity) {
      handleInvalid("No tank selected")
      return false
    }

    let targetSelectOptions: SelectOption[] = []

    const inlets = get(playerPod).fixedEntities.inlets
    const outlet = get(playerPod).fixedEntities.outlet
    const machines = get(machinesStore)

    // Add unattached inlets to the options
    for (const inletEntity of inlets) {
      targetSelectOptions.push({
        label: `Inlet #${machines[inletEntity].buildIndex}`,
        value: inletEntity,
        available: machines[inletEntity].tankConnection === EMPTY_CONNECTION,
      })
    }

    // Add outlet if unattached
    targetSelectOptions.push({
      label: "Outlet",
      value: outlet,
      available: machines[outlet].tankConnection === EMPTY_CONNECTION,
    })

    const targetEntity = await renderSelect(
      customInputContainerElement,
      Select,
      targetSelectOptions,
    )

    // Abort if nothing selected
    if (!targetEntity) {
      handleInvalid("Nothing selected")
      return false
    }

    return [tankEntity, targetEntity]
  }

  const onSubmit = async () => {
    // De-activate input-field
    inputActive = false

    // Write input to terminal
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.COMMAND,
      value.length == 0 ? "&nbsp;" : value,
      false,
      SYMBOLS[0],
    )

    // Unset store values
    selectedParameters.set([])

    // Evaluate input
    const command = evaluate(value)

    // Handle invalid command
    if (!command) {
      await handleInvalid("Invalid command")
      return
    }

    // We prompt the user for the information needed to execute the command
    let parameters: any[] | false = false

    // First, simply execute the command if it has no parameters
    if (NO_INPUT_COMMANDS.includes(command.id)) {
      // We add a select for commands that need to be confirmed
      if (command.id === COMMAND.WIPE) {
        parameters = await getConfirmation(command)
        if (!parameters) return
      }
      await executeCommand(command, [])
      return
    }

    if (SINGLE_INPUT_COMMANDS.includes(command.id)) {
      playSound("tcm", "selectionEnter")
      parameters = await getSingleInputCommandParameters(command)
    } else if (command.id === COMMAND.CONNECT) {
      playSound("tcm", "selectionEnter")
      parameters = await getConnectParameters()
    } else if (command.id === COMMAND.DISCONNECT) {
      playSound("tcm", "selectionEnter")
      parameters = await getDisconnectParameters()
    } else if (command.id === COMMAND.PLUG_TANK) {
      playSound("tcm", "selectionEnter")
      parameters = await getAttachTankParameters()
    }

    // Something went wrong in the parameter selection
    if (!parameters) return

    // Finally, execute the command with the parameters
    executeCommand(command, parameters)

    // Reset selected parameters
    selectedParameters.set([])

    focusInput()
  }

  const onInput = (e: KeyboardEvent) => {
    playInputSound(e)
    focusInput()
  }

  const onFocus = () => {
    hasFocus = true
  }
  const onBlur = () => {
    if ($activeTab == 0) setTimeout(focusInput, 10)
    hasFocus = false
  }

  onMount(async () => {
    if (terminalType === TERMINAL_TYPE.FULL) {
      await terminalMessages.startUp()
      inputActive = true
    }
    focusInput()
  })

  onDestroy(() => {
    if (setBlink) clearInterval(interval)
  })
</script>

<svelte:window
  on:keydown={() => {
    if ($activeTab == 0) {
      focusInput()
    }
  }}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="terminal" class="terminal" class:noOutput on:click={focusInput}>
  <!-- OUTPUT -->
  {#if !noOutput}
    {#each $terminalOutput as output, index (index)}
      <TerminalOutput {output} />
    {/each}
  {/if}

  <!-- CUSTOM INPUT => SELECT, NAMING -->
  <div
    id="custom-input-container"
    class="custom-input-container"
    bind:this={customInputContainerElement}
  />

  <!-- Input -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  {#if inputActive || noOutput}
    <TerminalInput
      {onSubmit}
      {placeholder}
      {onInput}
      {onFocus}
      {onBlur}
      bind:inputElement
      bind:value
      {focusInput}
    />
  {/if}
</div>

<style lang="scss">
  .terminal {
    font-family: var(--font-family);
    overflow: hidden;
    width: 100%;
    position: relative;
    white-space: pre-line;
    line-height: 1.15em;
    max-width: 69ch;
    text-transform: uppercase;
    backdrop-filter: blur(5px);

    &:not(.noOutput) {
      height: 100vh;
      padding: var(--default-padding);
      padding-bottom: 10ch;
    }
  }
</style>
