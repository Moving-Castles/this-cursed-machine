<script lang="ts">
  import { EMPTY_CONNECTION } from "@modules/utils/constants"
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
  } from "@components/Main/Terminal/"
  import { terminalOutput } from "@components/Main/Terminal/stores"
  import { evaluate } from "@components/Main/Terminal/functions/evaluate"
  import { playInputSound } from "@components/Main/Terminal/functions/sound"
  import { MACHINE_TYPE, PORT_INDEX } from "@modules/state/base/enums"
  import { writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
  import { createSelectOptions } from "@components/Main/Terminal/functions/selectOptions"
  import Select from "@components/Main/Terminal/Select.svelte"
  import TerminalOutput from "@components/Main/Terminal/TerminalOutput.svelte"
  import { scrollToEnd } from "@components/Main/Terminal/functions/helpers"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import { renderSelect } from "@components/Main/Terminal/functions/renderSelect"
  import { cursorCharacter } from "@modules/ui/stores"
  import { machineTypeToLabel, availablePorts } from "@modules/state/simulated"
  import {
    playerPod,
    machines as machinesStore,
  } from "@modules/state/base/stores"
  import { terminalMessages } from "./functions/terminalMessages"

  let inputElement: HTMLInputElement
  let userInput = ""
  let selectContainerElement: HTMLDivElement
  let interval: ReturnType<typeof setInterval>
  let inputActive = false
  let hasFocus = false

  export let terminalType: TERMINAL_TYPE = TERMINAL_TYPE.FULL
  export let placeholder = "HELP"
  export let setBlink = false
  export let noOutput = false

  const dispatch = createEventDispatcher()

  const focusInput = async e => {
    if (e.target.tagName.toUpperCase() !== "INPUT") {
      await tick()
      inputElement?.focus()
    }
  }

  export const resetInput = async () => {
    userInput = ""
    inputActive = true
    scrollToEnd()
    focusInput()
  }

  const handleInvalid = async (message: string) => {
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.ERROR,
      message,
      false,
      SYMBOLS[5]
    )
    resetInput()
  }

  const executeCommand = async (command: Command, parameters: any[]) => {
    // Execute function
    await command.fn(...parameters)
    // Note: It is the parent's responsibility to reset the input on this event
    dispatch("commandExecuted", { command, parameters })
  }

  const getSingleInputCommandParameters = async (
    command: Command
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
      selectOptions
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
      disconnectOptions
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
    // %%%%%%%%%%%%%%%%%%%%%%%%%%
    // %% Start source machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%

    // Get machines with available outgoing connection slots
    let sourceSelectOptions = createSelectOptions(
      COMMAND.CONNECT,
      DIRECTION.OUTGOING
    )

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "From:")

    const sourceMachineKey = await renderSelect(
      selectContainerElement,
      Select,
      sourceSelectOptions
    )

    // Abort if nothing selected
    if (!sourceMachineKey) {
      handleInvalid("No source machine")
      return false
    }

    let sourceMachineEntity = $simulatedMachines[sourceMachineKey]

    writeToTerminal(
      TERMINAL_OUTPUT_TYPE.SPECIAL,
      "From: " +
        machineTypeToLabel(sourceMachineEntity.machineType) +
        " #" +
        sourceMachineEntity.buildIndex,
      true,
      SYMBOLS[11]
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
    } else if (sourceMachineEntity.machineType === MACHINE_TYPE.PLAYER) {
      await writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Select source port:")
      let sourcePortOptions: SelectOption[] = []

      const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)

      const portLabel = p =>
        `Port #${p.portIndex + 1} (${p.portIndex === 0 ? "PISS" : "BLOOD"})`

      sourcePortOptions = ports.map(p => ({
        label: portLabel(p),
        value: p.portIndex,
      }))

      const sourcePort = (await renderSelect(
        selectContainerElement,
        Select,
        sourcePortOptions
      )) as PORT_INDEX

      // Abort if nothing selected
      if (!sourcePort && sourcePort !== 0) {
        handleInvalid("No port selected")
        return false
      }

      await writeToTerminal(
        TERMINAL_OUTPUT_TYPE.SPECIAL,
        "Port: #" + (sourcePort + 1),
        true,
        SYMBOLS[14]
      )

      portIndex = sourcePort
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
      DIRECTION.INCOMING
    ).filter(option => option.value !== sourceMachineKey)

    // Abort if no available targets
    if (targetSelectOptions.length === 0) {
      handleInvalid("No machines available")
      return false
    }

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "TO:")

    let targetMachineKey = await renderSelect(
      selectContainerElement,
      Select,
      targetSelectOptions
    )

    // Abort if nothing selected
    if (!targetMachineKey) {
      handleInvalid("No target machine")
      return false
    }

    let targetMachineEntity = $simulatedMachines[targetMachineKey]

    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.SPECIAL,
      "To: " +
        machineTypeToLabel(targetMachineEntity.machineType) +
        " #" +
        targetMachineEntity.buildIndex,
      true,
      SYMBOLS[14]
    )

    // %%%%%%%%%%%%%%%%%%%%%%%%
    // %% End target machine %%
    // %%%%%%%%%%%%%%%%%%%%%%%%

    return [sourceMachineKey, targetMachineKey, portIndex]
  }

  const getAttachDepotParameters = async (): Promise<any[] | false> => {
    // Get depots
    let sourceSelectOptions = createSelectOptions(COMMAND.ATTACH_DEPOT)

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Depot:")

    const depotEntity = await renderSelect(
      selectContainerElement,
      Select,
      sourceSelectOptions
    )

    // Abort if nothing selected
    if (!depotEntity) {
      handleInvalid("No depot selected")
      return false
    }

    let targetSelectOptions: SelectOption[] = []

    const inlets = get(playerPod).fixedEntities.inlets
    const outlet = get(playerPod).fixedEntities.outlet
    const machines = get(machinesStore)

    // Add unattached inlets to the options
    for (const inletEntity of inlets) {
      if (machines[inletEntity].depotConnection !== EMPTY_CONNECTION) continue
      targetSelectOptions.push({
        label: `Inlet #${machines[inletEntity].buildIndex}`,
        value: inletEntity,
      })
    }

    // Add outlet if unattached
    if (machines[outlet].depotConnection === EMPTY_CONNECTION) {
      targetSelectOptions.push({
        label: "Outlet",
        value: outlet,
      })
    }

    const targetEntity = await renderSelect(
      selectContainerElement,
      Select,
      targetSelectOptions
    )

    // Abort if nothing selected
    if (!targetEntity) {
      handleInvalid("Nothing selected")
      return false
    }

    return [depotEntity, targetEntity]
  }

  const onSubmit = async () => {
    // De-activate input-field
    inputActive = false

    // Write input to terminal
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.COMMAND,
      userInput,
      false,
      SYMBOLS[0]
    )

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
    } else if (command.id === COMMAND.ATTACH_DEPOT) {
      parameters = await getAttachDepotParameters()
    }

    // Something went wrong in the parameter selection
    if (!parameters) return

    // Finally, execute the command with the parameters
    executeCommand(command, parameters)
  }

  const onInput = (e: KeyboardEvent) => {
    playInputSound(e)
  }

  onMount(async () => {
    cursorCharacter.set("█")
    if (terminalType === TERMINAL_TYPE.FULL) {
      await terminalMessages.startUp()
      inputActive = true
    }
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
        on:focus={() => (hasFocus = true)}
        on:blur={() => (hasFocus = false)}
        {placeholder}
        on:keydown={onInput}
        bind:this={inputElement}
        bind:value={userInput}
      />
      <div
        class="blinker"
        class:blink={userInput.length === 0}
        class:empty={userInput === ""}
        style:transform="translate({userInput.length}ch, -2px) scaleX(1.5) "
      >
        █
      </div>
    </form>
  {/if}
</div>

<style lang="scss">
  .terminal {
    font-family: var(--font-family);
    overflow: hidden;
    width: 100%;
    position: relative;
    white-space: pre-line;
    line-height: 1.1em;
    max-width: 69ch;
    text-transform: uppercase;
    background-color: rgba(0, 0, 0, 0.5);
    // background-image: url(/images/broken.png);
    // background-size: cover;
    backdrop-filter: blur(10px);
    // text-shadow: 1px 1px 5px rgba(255, 255, 255, 0.2);

    &:not(.noOutput) {
      height: 100vh;
      padding: var(--default-padding);
      padding-bottom: 6ch;
    }

    form {
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
        color: var(--foreground);
        width: 100%;

        .terminal-input {
          display: inline-block;
          width: auto;
        }
      }

      input {
        caret-color: transparent;
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

        &::placeholder {
          opacity: 1;
          color: #666;
        }

        &:focus {
          border: none;
          outline: none;
        }
      }

      .blinker {
        opacity: 1;
        position: absolute;
        left: 3ch;
        display: inline-block;
        transform-origin: top left;

        &.empty {
          color: #666;
        }
      }
    }
  }
</style>
