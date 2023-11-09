<script lang="ts">
  import { tick, createEventDispatcher, onMount, onDestroy } from "svelte"
  import {
    COMMAND,
    OutputType,
    TerminalType,
    DIRECTION,
    type SelectOption,
  } from "./types"
  import { SYMBOLS, SINGLE_INPUT_COMMANDS, terminalOutput } from "./index"
  import { evaluate } from "./functions/evaluate"
  import { playInputSound } from "./functions/sound"
  import {
    MachineType,
    MaterialType,
    PortIndex,
  } from "../../modules/state/enums"
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
  import { playerCore } from "../../modules/state"
  import { localLevel, cursorCharacter } from "../../modules/ui/stores"
  import { clearTerminalOutput } from "./functions/helpers"
  import { writeNewLevel } from "./functions/writeNewLevel"
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
    $playerCore &&
    $playerCore.level !== $localLevel
  ) {
    handleLevelChange($playerCore.level)
  }

  const handleLevelChange = async (level: number) => {
    localLevel.set(level)
    inputActive = false
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log("level change detected")
    clearTerminalOutput()
    await writeNewLevel(level)
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

  const onSubmit = async () => {
    // De-activate input-field
    inputActive = false

    // Write input to terminal
    await writeToTerminal(OutputType.COMMAND, userInput, false, SYMBOLS[0])

    // Evaluate input
    const command = evaluate(userInput)

    // Handle invalid command
    if (!command) {
      await writeToTerminal(
        OutputType.ERROR,
        "Command not found",
        noOutput,
        SYMBOLS[5]
      )
      resetInput()
      return
    }

    // To be filled with required parameter values
    // @todo: typing
    let parameters: any[] = []

    // Get required parameter values and execute command
    if (SINGLE_INPUT_COMMANDS.includes(command.id)) {
      const selectOptions = createSelectOptions(command.id)

      // Abort if no options
      if (selectOptions.length === 0) {
        await writeToTerminal(OutputType.ERROR, "Nothing", false, SYMBOLS[4])
        resetInput()
        return
      }

      let value = await renderSelect(
        selectContainerElement,
        Select,
        selectOptions
      )

      // Abort if nothing selected
      if (!value) {
        await writeToTerminal(
          OutputType.ERROR,
          "Nothing selected",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      // Push the value to parameters
      parameters = [value]
    } else if (command.id === COMMAND.DISCONNECT) {
      let disconnectOptions = createSelectOptions(COMMAND.DISCONNECT)

      const connectionId = await renderSelect(
        selectContainerElement,
        Select,
        disconnectOptions
      )

      // Get the port index that this connection belongs to

      // Abort if nothing selected
      if (
        !connectionId ||
        !$simulatedConnections.find(c => c.id === connectionId)
      ) {
        await writeToTerminal(
          OutputType.ERROR,
          "No connection",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      const connection = $simulatedConnections.find(c => c.id === connectionId)

      console.log(connection)

      console.log(connection.sourceMachine, connection.portIndex)

      parameters = [connection.sourceMachine, connection.portIndex]
    } else if (command.id === COMMAND.CONNECT) {
      // %%%%%%%%%%%%%%%%%%%%%%%%
      // %% Get source machine %%
      // %%%%%%%%%%%%%%%%%%%%%%%%

      // Get machines with available outgoing connection slots
      let sourceSelectOptions = createSelectOptions(
        COMMAND.CONNECT,
        DIRECTION.OUTGOING
      )

      await writeToTerminal(OutputType.NORMAL, "From:")

      let sourceMachineKey = await renderSelect(
        selectContainerElement,
        Select,
        sourceSelectOptions
      )

      // Abort if nothing selected
      if (!sourceMachineKey) {
        await writeToTerminal(
          OutputType.ERROR,
          "No source machine",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
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
        SYMBOLS[11]
      )

      // %%%%%%%%%%%%%%%%%%%%%%%%
      // %% Get target machine %%
      // %%%%%%%%%%%%%%%%%%%%%%%%

      // Get machines with available incoming connection slots
      let targetSelectOptions = createSelectOptions(
        COMMAND.CONNECT,
        DIRECTION.INCOMING
      )

      // Abort if no available targets
      if (targetSelectOptions.length === 0) {
        await writeToTerminal(
          OutputType.ERROR,
          "No machines available",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      await writeToTerminal(OutputType.NORMAL, "TO:")

      let targetMachineKey = await renderSelect(
        selectContainerElement,
        Select,
        targetSelectOptions
      )

      // Abort if nothing selected
      if (!targetMachineKey) {
        await writeToTerminal(
          OutputType.ERROR,
          "No target machine",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
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
        SYMBOLS[14]
      )

      if (sourceMachineEntity.machineType === MachineType.SPLITTER) {
        const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)

        parameters = [sourceMachineKey, targetMachineKey, ports[0].portIndex]
      } else if (sourceMachineEntity.machineType === MachineType.CORE) {
        await writeToTerminal(OutputType.NORMAL, "Select source port:")
        let sourcePortOptions: SelectOption[] = []

        const ports = availablePorts(sourceMachineEntity, DIRECTION.OUTGOING)

        const portLabel = p =>
          `Port #${p.portIndex + 1} (${p.portIndex === 0 ? "PISS" : "BLOOD"})`
        sourcePortOptions = ports.map(p => ({
          label: portLabel(p),
          value: p.portIndex,
        }))

        console.log(sourcePortOptions)

        let sourcePort = await renderSelect(
          selectContainerElement,
          Select,
          sourcePortOptions
        )

        console.log(sourcePort)

        // Abort if nothing selected
        if (!sourcePort) {
          await writeToTerminal(
            OutputType.ERROR,
            "No port selected",
            false,
            SYMBOLS[5]
          )
          resetInput()
          return
        }

        parameters = [sourceMachineKey, targetMachineKey, sourcePort]
      } else {
        // Use the first one available
        parameters = [sourceMachineKey, targetMachineKey, PortIndex.FIRST]
      }
    }

    // The two commands allowed at spawn (blink and help) take the terminal type as parameter
    if (terminalType === TerminalType.SPAWN) {
      parameters = [terminalType]
    }

    // Execute function
    await command.fn(...parameters)

    // Note: It is the parents responibility to reset the input on this event
    dispatch("commandExecuted", { command, parameters })
  }

  const onInput = (e: KeyboardEvent) => {
    playInputSound(e)
  }

  onMount(() => {
    cursorCharacter.set("█")
    inputElement?.focus()
    // if (setBlink)
    //   interval = setInterval(
    //     () => cursorCharacter.set($cursorCharacter === "" ? "█" : ""),
    //     400
    //   )
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
      <!-- style:width="{userInput.length}ch" -->
      <!-- <span>
        {$cursorCharacter}
      </span> -->
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
      padding: 0.5em 0.5em 4em;
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
