<script lang="ts">
  import { tick, createEventDispatcher, onMount, onDestroy } from "svelte"
  import {
    COMMAND,
    OutputType,
    TerminalType,
    DIRECTION,
    type Command,
    type SelectOption,
  } from "./types"
  import {
    SYMBOLS,
    NO_INPUT_COMMANDS,
    SINGLE_INPUT_COMMANDS,
    terminalOutput,
  } from "./index"
  import { evaluate } from "./functions/evaluate"
  import { playInputSound } from "./functions/sound"
  import { MachineType, PortIndex } from "../../modules/state/enums"
  import { writeToTerminal } from "./functions/writeToTerminal"
  import { createSelectOptions } from "./functions/selectOptions"
  import Select from "./Select.svelte"
  import TerminalOutput from "./TerminalOutput.svelte"
  import { scrollToEnd } from "./functions/helpers"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "../../modules/simulator"
  import { renderSelect } from "./functions/renderSelect"
  import { playerEntity, storages, playerPod } from "../../modules/state"
  import { localLevel, cursorCharacter } from "../../modules/ui/stores"
  import { clearTerminalOutput } from "./functions/helpers"
  import { writeLevel } from "./functions/writeLevel"
  import {
    machineTypeToLabel,
    availablePorts,
  } from "../../modules/state/convenience"

  let inputElement: HTMLInputElement
  let userInput = ""
  let selectContainerElement: HTMLDivElement
  let interval: ReturnType<typeof setInterval>
  let inputActive = false

  export let terminalType: TerminalType = TerminalType.FULL
  export let placeholder = "HELP"
  export let setBlink = false
  export let noOutput = false

  const dispatch = createEventDispatcher()

  $: if (
    terminalType == TerminalType.FULL &&
    $playerEntity &&
    $playerEntity.level !== $localLevel
  ) {
    handleLevelChange($playerEntity.level)
  }

  const handleLevelChange = async (level: number) => {
    localLevel.set(level)
    inputActive = false
    await new Promise(resolve => setTimeout(resolve, 500))
    clearTerminalOutput()
    await writeLevel(level)
    resetInput()
    inputActive = true
  }

  const focusInput = async () => {
    await tick()
    inputElement?.focus()
  }

  export const resetInput = async () => {
    userInput = ""
    inputActive = true
    scrollToEnd()
    focusInput()
  }

  const handleInvalid = async (message: string) => {
    await writeToTerminal(OutputType.ERROR, message, false, SYMBOLS[5])
    resetInput()
  }

  const executeCommand = async (command: Command, parameters: any[]) => {
    // Execute function
    await command.fn(...parameters)
    // Note: It is the parents responsibility to reset the input on this event
    dispatch("commandExecuted", { command, parameters })
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
      selectContainerElement,
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

    const connectionId = await renderSelect(
      selectContainerElement,
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

    return [connection?.sourceMachine, connection?.portIndex]
  }

  const getConnectParameters = async (): Promise<any[] | false> => {
    // %%%%%%%%%%%%%%%%%%%%%%%%
    // %% Get source machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%

    // Get machines with available outgoing connection slots
    let sourceSelectOptions = createSelectOptions(
      COMMAND.CONNECT,
      DIRECTION.OUTGOING,
    )

    await writeToTerminal(OutputType.NORMAL, "From:")

    const sourceMachineKey = await renderSelect(
      selectContainerElement,
      Select,
      sourceSelectOptions,
    )

    // Abort if nothing selected
    if (!sourceMachineKey) {
      handleInvalid("No source machine")
      return false
    }

    let sourceMachineEntity = $simulatedMachines[sourceMachineKey]

    writeToTerminal(
      OutputType.SPECIAL,
      "From: " +
        machineTypeToLabel(sourceMachineEntity.machineType) +
        (sourceMachineEntity.buildIndex
          ? " #" + sourceMachineEntity.buildIndex
          : ""),
      true,
      SYMBOLS[11],
    )

    // %%%%%%%%%%%%%%%%%%%%%%%%
    // %% Get target machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%

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

    await writeToTerminal(OutputType.NORMAL, "TO:")

    let targetMachineKey = await renderSelect(
      selectContainerElement,
      Select,
      targetSelectOptions,
    )

    // Abort if nothing selected
    if (!targetMachineKey) {
      handleInvalid("No target machine")
      return false
    }

    let targetMachineEntity = $simulatedMachines[targetMachineKey]

    await writeToTerminal(
      OutputType.SPECIAL,
      "To: " +
        machineTypeToLabel(targetMachineEntity.machineType) +
        (targetMachineEntity.buildIndex
          ? " #" + targetMachineEntity.buildIndex
          : ""),
      true,
      SYMBOLS[14],
    )

    /** Exceptions first */

    // Handle splitter port selection
    if (sourceMachineEntity.machineType === MachineType.SPLITTER) {
      const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)
      // Use the first available one
      return [sourceMachineKey, targetMachineKey, ports[0].portIndex]
    } else if (sourceMachineEntity.machineType === MachineType.PLAYER) {
      await writeToTerminal(OutputType.NORMAL, "Select source port:")
      let sourcePortOptions: SelectOption[] = []

      const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)

      const portLabel = p =>
        `Port #${p.portIndex + 1} (${p.portIndex === 0 ? "PISS" : "BLOOD"})`

      sourcePortOptions = ports.map(p => ({
        label: portLabel(p),
        value: p.portIndex,
      }))

      const sourcePort = await renderSelect(
        selectContainerElement,
        Select,
        sourcePortOptions,
      )

      // Abort if nothing selected
      if (!sourcePort && sourcePort !== 0) {
        handleInvalid("No port selected")
        return false
      }

      return [sourceMachineKey, targetMachineKey, sourcePort]
    } else {
      // Use the first one
      return [sourceMachineKey, targetMachineKey, PortIndex.FIRST]
    }
  }

  const getConnectStorageParameters = async (): Promise<any[] | false> => {
    // %%%%%%%%%%%%%%%%%%%%%%%%
    // %% Get storage %%
    // %%%%%%%%%%%%%%%%%%%%%%%%

    if (
      ($storages[$playerPod.fixedEntities?.inletEntity]?.storageConnection ?? null) !== null &&
      ($storages[$playerPod.fixedEntities?.outletEntity]?.storageConnection ?? null) !== null
    ) {
      handleInvalid("No open point")
      return false
    }

    // Get stores
    let sourceSelectOptions = createSelectOptions(COMMAND.CONNECT_STORAGE)

    await writeToTerminal(OutputType.NORMAL, "Store:")

    const storageKey = await renderSelect(
      selectContainerElement,
      Select,
      sourceSelectOptions,
    )

    // Abort if nothing selected
    if (!storageKey) {
      handleInvalid("No storage selected")
      return false
    }

    let networkPointSelectOptions: SelectOption[] = []

    if (
      ($storages[$playerPod.inletEntity]?.storageConnection ?? null) == null
    ) {
      networkPointSelectOptions.push({
        label: "Inlet",
        value: MachineType.INLET,
      })
    }

    if (
      ($storages[$playerPod.outletEntity]?.storageConnection ?? null) == null
    ) {
      networkPointSelectOptions.push({
        label: "Outlet",
        value: MachineType.OUTLET,
      })
    }

    const networkPointType = await renderSelect(
      selectContainerElement,
      Select,
      networkPointSelectOptions,
    )

    // Abort if nothing selected
    if (!networkPointType) {
      handleInvalid("Nothing selected")
      return false
    }

    return [storageKey, networkPointType]
  }

  const onSubmit = async () => {
    // De-activate input-field
    inputActive = false

    // Write input to terminal
    await writeToTerminal(OutputType.COMMAND, userInput, false, SYMBOLS[0])

    // Return the input and abort if this is the naming terminal
    if (terminalType === TerminalType.NAMING) {
      dispatch("commandExecuted", { userInput })
      return
    }

    // Evaluate input
    const command = evaluate(userInput)

    // Handle invalid command
    if (!command) {
      await handleInvalid("Invalid command")
      return
    }

    // First, simply execute the command if it has no parameters
    if (NO_INPUT_COMMANDS.includes(command.id)) {
      await executeCommand(command, [])
      return
    }

    // We prompt the user for the information needed to execute the command

    let parameters: any[] | false = false

    if (SINGLE_INPUT_COMMANDS.includes(command.id)) {
      parameters = await getSingleInputCommandParameters(command)
    } else if (command.id === COMMAND.CONNECT) {
      parameters = await getConnectParameters()
    } else if (command.id === COMMAND.DISCONNECT) {
      parameters = await getDisconnectParameters()
    } else if (command.id === COMMAND.CONNECT_STORAGE) {
      parameters = await getConnectStorageParameters()
    }

    // Something went wrong in the parameter selection
    if (!parameters) return

    // Finally, execute the command with the parameters
    executeCommand(command, parameters)
  }

  const onInput = (e: KeyboardEvent) => {
    playInputSound(e)
  }

  onMount(() => {
    cursorCharacter.set("█")
    inputElement?.focus()
  })

  onDestroy(() => {
    if (setBlink) clearInterval(interval)
  })
</script>

<svelte:window on:keydown={focusInput} />

<div id="terminal" class="terminal" class:noOutput>
  <!-- OUTPUT -->
  {#if !noOutput}
    {#each $terminalOutput as output, index (index)}
      <TerminalOutput {output} />
    {/each}
  {/if}

  <!-- SELECT -->
  <div class="select-container" bind:this={selectContainerElement} />

  <!-- INPUT -->
  {#if inputActive || noOutput}
    <form on:submit|preventDefault={onSubmit}>
      <span class="prompt-symbol">
        {SYMBOLS[0]}
      </span>
      <input
        class="terminal-input"
        type="text"
        {placeholder}
        on:keydown={onInput}
        bind:this={inputElement}
        bind:value={userInput}
      />
    </form>
  {/if}
</div>

<style lang="scss">
  .terminal {
    font-family: var(--font-family);
    overflow: hidden;
    color: var(--terminal-color);
    background: var(--terminal-background);
    width: 100%;
    position: relative;
    white-space: pre-line;
    line-height: 1.2em;
    max-width: 69ch;

    &:not(.noOutput) {
      height: 100vh;
      padding: var(--default-padding);
      padding-bottom: 4ch;
    }

    form {
      color: var(--terminal-color);
      font-family: var(--font-family);
      border: none;
      outline: none;
      left: 1em;
      display: flex;

      .prompt-symbol {
        white-space: nowrap;
        vertical-align: middle;
        margin-right: 1ch;
        color: inherit;
      }

      .terminal-input-wrapper {
        color: white;
        width: 100%;

        .terminal-input {
          display: inline-block;
          width: auto;
        }
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
        padding: 0;
        position: relative; /* To position the pseudo-element */
        // caret-color: transparent;

        &:focus {
          border: none;
          outline: none;
        }
        // }
      }
    }
  }
</style>
