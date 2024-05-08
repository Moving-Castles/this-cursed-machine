<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { player } from "@modules/state/base/stores"
  import {
    COMMAND,
    TERMINAL_OUTPUT_TYPE,
    TERMINAL_TYPE,
  } from "@components/Main/Terminal/enums"
  import { currentMessage, tutorialProgress } from "@modules/ui/assistant"
  import { typeWriteToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
  import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"
  import { marked } from "marked"

  import Terminal from "@components/Main/Terminal/Terminal.svelte"

  const dispatch = createEventDispatcher()

  let terminalComponent: any

  const handleCommand = async (e: any) => {
    if (e.detail.command.id === COMMAND.SKIP) {
      dispatch("done")
    }
    if (e.detail.command.id === COMMAND.BLINK) {
      $tutorialProgress++
      clearTerminalOutput()
    }

    if (terminalComponent) {
      terminalComponent.resetInput()
    }
  }

  const replaceLine = (line: string) => {
    line = line.replaceAll("<a", "<a target='_blank' ")
    const elements = document.querySelectorAll(".output-content")
    const lastElement = elements[elements.length - 1]
    if (lastElement) {
      // Get the first elements. These are the symbols
      const symbols = (lastElement.textContent || lastElement.innerText).slice(
        0,
        2
      )

      lastElement.innerHTML = symbols + line

      // Remove empty <p></p> tags
      lastElement.innerHTML = lastElement.innerHTML.replace(/<p><\/p>/g, "")
    }
    // console.log(terminalComponent)
  }

  onMount(async () => {
    if ($currentMessage?.explanation) {
      const messages = $currentMessage?.explanation
        .split("\n")
        .map(msg => msg.replaceAll("%PLAYER%", $player.name))
        .filter(msg => msg !== "")

      for (const message of messages) {
        // Find the first occurrence of a pattern between curly braces
        let match = message.match(/{(.*?)}/)

        // Extract the value between the curly braces
        let value = match ? match[1] : null
        let outputType: string = TERMINAL_OUTPUT_TYPE.NORMAL

        if (value !== null) {
          if (value in TERMINAL_OUTPUT_TYPE) {
            outputType = TERMINAL_OUTPUT_TYPE[value]
          }
        }

        // Remove the entire match from the string
        let newMessage = message.replace(/{.*?}/, "")

        function extractContents(s: string) {
          const span = document.createElement("span")
          span.innerHTML = s
          return span.textContent || span.innerText
        }

        let line = marked(newMessage)
        line = line.replace(/^<p>|<\/p>$/g, "")
        const cleanedMessage = extractContents(line)
        await typeWriteToTerminal(outputType, cleanedMessage)

        // Now replace the message with the html version of it
        await replaceLine(line)
      }
    }
  })
</script>

<div class="completed">
  <Terminal
    bind:this={terminalComponent}
    terminalType={TERMINAL_TYPE.completed}
    placeholder="BLINK"
    setBlink
    skipBootMessage
    on:commandExecuted={e => handleCommand(e)}
  />
</div>

<style lang="scss">
  .completed {
    position: fixed;
    inset: 0;
    background-color: var(--background);
    background-size: cover;
    background-position: center;
    z-index: var(--z-1);
    display: flex;
    align-items: center;
    justify-items: center;
    user-select: none;
    cursor: pointer;

    :global(a) {
      color: var(--color-success) !important;
    }
  }

  :global(p.normal) {
    /* margin-bottom: 1rem; */
  }

  p:not(.output-content) {
    display: inline;
  }
</style>
