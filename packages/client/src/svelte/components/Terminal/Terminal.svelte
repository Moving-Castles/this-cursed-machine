<script lang="ts">
  import { tick, createEventDispatcher } from "svelte"
  import { COMMAND, OutputType, TerminalType } from "./types"
  import type { SelectOption } from "./types"
  import { SYMBOLS, SINGLE_INPUT_COMMANDS, terminalOutput } from "./index"
  import { evaluate } from "./functions/evaluate"
  import { playInputSound } from "./functions/sound"
  import {
    MachineType,
    PortType,
    MaterialType,
  } from "../../modules/state/enums"
  import { writeToTerminal } from "./functions/writeToTerminal"
  import { createSelectOptions } from "./functions/selectOptions"
  import Select from "./Select.svelte"
  import TerminalOutput from "./TerminalOutput.svelte"
  import { getMachinePorts, scrollToEnd } from "./functions/helpers"
  import { simulatedMachines, simulatedPorts } from "../../modules/simulator"
  import { renderSelect } from "./functions/renderSelect"
  import { playerCore } from "../../modules/state"
  import { localLevel } from "../../modules/ui/stores"
  import { clearTerminalOutput } from "./functions/helpers"
  import { writeNewLevel } from "./functions/writeNewLevel"

  let inputElement: HTMLInputElement
  let userInput = ""
  let inputActive = false
  let selectContainerElement: HTMLDivElement

  export let terminalType: TerminalType = TerminalType.FULL
  export let placeholder = "HELP"

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
    const command = evaluate(userInput, terminalType)

    // Handle invalid command
    if (!command) {
      await writeToTerminal(
        OutputType.ERROR,
        "Command not found",
        false,
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
    } else if (command.id === COMMAND.CONNECT) {
      // %%%%%%%%%%%%%%%%%%%%%%%%
      // %% Get source machine %%
      // %%%%%%%%%%%%%%%%%%%%%%%%

      let sourceSelectOptions = createSelectOptions(
        COMMAND.CONNECT,
        PortType.OUTPUT
      )

      // @todo: Does the machine have multiple output ports?

      await writeToTerminal(OutputType.NORMAL, "From:")

      let sourceMachine = await renderSelect(
        selectContainerElement,
        Select,
        sourceSelectOptions
      )

      // Abort if nothing selected
      if (!sourceMachine) {
        await writeToTerminal(
          OutputType.ERROR,
          "No source machine",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      let sourceMachineEntity = $simulatedMachines[sourceMachine]

      writeToTerminal(
        OutputType.SPECIAL,
        "From: " +
          MachineType[sourceMachineEntity.machineType || MachineType.NONE] +
          (sourceMachineEntity.buildIndex
            ? " #" + sourceMachineEntity.buildIndex
            : ""),
        true,
        SYMBOLS[11]
      )

      // %%%%%%%%%%%%%%%%%%%%%%%%
      // %% Get target machine %%
      // %%%%%%%%%%%%%%%%%%%%%%%%

      let targetSelectOptions = createSelectOptions(
        COMMAND.CONNECT,
        PortType.INPUT
      )

      // @todo: Does the machine have multiple input ports?

      await writeToTerminal(OutputType.NORMAL, "TO:")

      let targetMachine = await renderSelect(
        selectContainerElement,
        Select,
        targetSelectOptions
      )

      // Abort if nothing selected
      if (!targetMachine) {
        await writeToTerminal(
          OutputType.ERROR,
          "No target machine",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      let targetMachineEntity = $simulatedMachines[targetMachine]

      await writeToTerminal(
        OutputType.SPECIAL,
        "To: " +
          MachineType[targetMachineEntity.machineType || MachineType.NONE] +
          (targetMachineEntity.buildIndex
            ? " #" + targetMachineEntity.buildIndex
            : ""),
        true,
        SYMBOLS[14]
      )

      // %%%%%%%%%%%%%%%
      // %% Get ports %%
      // %%%%%%%%%%%%%%%

      let sourcePorts =
        getMachinePorts(String(sourceMachine), PortType.OUTPUT) || []
      let targetPorts =
        getMachinePorts(String(targetMachine), PortType.INPUT) || []

      if (sourcePorts.length === 0 || targetPorts.length === 0) {
        await writeToTerminal(
          OutputType.ERROR,
          "Could not connect machines",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      // If the source machine is the core:
      // Allow selecting the output port
      if (sourceMachineEntity.machineType === MachineType.CORE) {
        await writeToTerminal(OutputType.NORMAL, "Select source port:")
        let sourcePortOptions: SelectOption[] = []

        for (let i = 0; i < sourcePorts.length; i++) {
          let currenPortEntity = $simulatedPorts[sourcePorts[i][0]]
          sourcePortOptions.push({
            label: `Port #${i + 1}: ${
              MaterialType[
                currenPortEntity.product?.materialType || MaterialType.NONE
              ]
            }`,
            value: sourcePorts[i][0],
          })
        }

        let sourcePort = await renderSelect(
          selectContainerElement,
          Select,
          sourcePortOptions
        )

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

        parameters = [sourcePort, targetPorts[0][0]]
      } else {
        // Use the first one available
        parameters = [sourcePorts[0][0], targetPorts[0][0]]
      }
    }

    // The two commands allowed at spawn (blink and help) take ther terminal type as parameter
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
</script>

<svelte:window on:keydown={focusInput} />

<div id="terminal" class="terminal">
  <!-- OUTPUT -->
  {#each $terminalOutput as output, index (index)}
    <TerminalOutput {output} />
  {/each}

  <!-- SELECT -->
  <div class="select-container" bind:this={selectContainerElement} />

  <!-- INPUT -->
  {#if inputActive}
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
    padding: 1em;
    overflow: hidden;
    color: var(--terminal-color);
    background: var(--terminal-background);
    width: 100%;
    position: relative;
    height: 100vh;
    white-space: pre-line;
    padding-bottom: 4em;
    line-height: 1.2em;
    max-width: 69ch;

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

        &:focus {
          border: none;
          outline: none;
        }
        // }
      }
    }
  }
</style>
