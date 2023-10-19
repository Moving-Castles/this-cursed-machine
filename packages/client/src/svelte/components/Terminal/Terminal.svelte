<script lang="ts">
  import { onMount, tick } from "svelte"
  import { COMMAND, OutputType } from "./types"
  import type { SelectOption } from "./types"
  import { SYMBOLS, SINGLE_INPUT_COMMANDS, terminalOutput } from "./index"
  import { evaluate } from "./functions/evaluate"
  import { playInputSound } from "./functions/sound"
  import { MachineType, PortType } from "../../modules/state/enums"
  import { writeToTerminal } from "./functions/writeToTerminal"
  import { createSelectOptions } from "./functions/selectOptions"
  import Select from "./Select.svelte"
  import TerminalOutput from "./TerminalOutput.svelte"
  import { getMachinePorts } from "./functions/helpers"
  import { simulatedMachines } from "../../modules/simulator"

  let inputElement: HTMLInputElement
  let userInput = ""
  let inputActive = true
  let selectContainerElement: HTMLDivElement

  const focusInput = async () => {
    await tick()
    inputElement?.focus()
  }

  const resetInput = async () => {
    userInput = ""
    inputActive = true
    focusInput()
  }

  /**
   * Renders a select component and resolves a promise when a value is selected.
   * @param {SelectOption[]} selectOptions - Array of options for the select component.
   * @returns {Promise<string | MachineType | null>} Resolves to the selected value which can be a string, a MachineType or null
   */
  async function renderSelect(
    selectOptions: SelectOption[]
  ): Promise<string | MachineType | null> {
    return new Promise(resolve => {
      const component = new Select({
        target: selectContainerElement,
        props: {
          selectOptions,
          returnFunction: (value: string | MachineType | null) => {
            resolve(value)
          },
        },
      })
      // Listen to the custom event we're dispatching
      component.$on("requestDestroy", () => {
        component.$destroy() // Actually destroy the component
      })
    })
  }

  const onSubmit = async () => {
    // De-activate input-field
    inputActive = false

    // Write input to terminal
    writeToTerminal(OutputType.COMMAND, userInput, false, SYMBOLS[0])

    // Evaluate input
    const command = evaluate(userInput)

    // Handle invalid command
    if (!command) {
      writeToTerminal(OutputType.ERROR, "Command not found", false, SYMBOLS[5])
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
        writeToTerminal(OutputType.ERROR, "Nothing", false, SYMBOLS[4])
        resetInput()
        return
      }

      let value = await renderSelect(selectOptions)

      // Abort if nothing selected
      if (!value) {
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

      writeToTerminal(OutputType.NORMAL, "Select source machine:")

      let sourceMachine = await renderSelect(sourceSelectOptions)

      // Abort if nothing selected
      if (!sourceMachine) {
        writeToTerminal(
          OutputType.ERROR,
          "No source machine",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      writeToTerminal(
        OutputType.SPECIAL,
        `Source: ${
          MachineType[
            $simulatedMachines[sourceMachine]?.machineType || MachineType.NONE
          ]
        }`,
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

      await writeToTerminal(OutputType.NORMAL, "Select target machine:")

      let targetMachine = await renderSelect(targetSelectOptions)

      // Abort if nothing selected
      if (!targetMachine) {
        writeToTerminal(
          OutputType.ERROR,
          "No target machine",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      writeToTerminal(
        OutputType.SPECIAL,
        `Target: ${
          MachineType[
            $simulatedMachines[targetMachine]?.machineType || MachineType.NONE
          ]
        }`,
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
        writeToTerminal(
          OutputType.ERROR,
          "Could not connect machines",
          false,
          SYMBOLS[5]
        )
        resetInput()
        return
      }

      // Push the values to parameters
      // @todo: handle port selection, for now use the first available
      parameters = [sourcePorts[0][0], targetPorts[0][0]]
    }

    // Execute function
    await command.fn(...parameters)

    // Reset input
    resetInput()
  }

  const onInput = (e: KeyboardEvent) => {
    playInputSound(e)
  }

  onMount(() => {
    resetInput()
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="terminal" on:click={focusInput} class="terminal">
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
        id="terminal-input"
        class="terminal-input"
        type="text"
        placeholder="HELP"
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
    border: 1px solid var(--terminal-color);
    padding-bottom: 2em;
    line-height: 1.2em;

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
