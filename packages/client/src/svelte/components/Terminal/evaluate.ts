import AsciiTextGenerator from "ascii-text-generator"
import { get } from "svelte/store"
import { output, symbols } from "./index"
import { MachineType } from "../../modules/state/enums"
import { playerCore, playerEntityId } from "../../modules/state"
import { simulatedMachines, readableConnections } from "../../modules/simulator"
import { resolve } from "../../modules/action"

/**
 * Evaluate string output
 * @param string
 */
export const evaluate = (
  string: string,
  dispatch: Function,
  send: Function
) => {
  // Get the arguments
  const args = string.split(" ").splice(1)

  // Clean input
  string = string.toLowerCase().trim()

  // Enter game
  if (string === "blink") {
    dispatch("done")
  }

  // Clear
  if (string === "clear") {
    output.set([])
  }

  // Highlight core
  if (string === "whoami") {
    const rect = document.getElementById(`node-${get(playerEntityId)}`)
    if (rect) {
      rect.classList.remove("flash-a-little")
      setTimeout(() => {
        rect.classList.add("flash-a-little")
      }, 1)
    }
  }

  /**
   * Display help
   */
  if (string === "h" || string === "help") {
    const commandList = `
    Commands:
    Build         Create a machine
    Connect       Connect machines
    Destroy       Destroy machines
    Disconnect    Disconnect machines
          `
    // List all available commands
    send(commandList.replaceAll(" ", "&nbsp;"))
  }

  /**
   * Show agreement
   */
  if (string === "read") {
    const agreement = `
      +_______________________________________+
      | Agreement between ${get(playerCore).name} |
      | and Puppitywink.                      |
      |                                       |
      | All of your rights r belong to me.    |
      |                                       |
      | -- xoxo puppitywink                   |
      |                                       |
      | SIGNED                                |
      |                                       |
      |                                       |
      | Date: ${Date.now()}                   |
      |                                       |
      | Location: Box nr. 69                  |
      |                                       |
      |    Ur signature       puppitywink     |
      |                                       |
      |     akjddaskjakjh       PxP           |
      |       kdskjd            PWP           |
      |                         PXP           |
      +_______________________________________+

      `
    send(agreement.replaceAll(" ", "&nbsp;"))
  }

  /**
   * Resolve network on chain
   */
  if (string === "resolve") {
    resolve()
  }

  if (string === "disconnect") {
    if (get(readableConnections).length === 0) {
      send("Can't disconnect if you ain't connected")
    } else {
      return "disconnect"
    }
  }

  /**
   * Show build interface
   */
  if (string === "build" || string === "connect" || string === "destroy") {
    // show an input
    return string
  }

  /**
   * List box contents
   */
  if (string === "contents" || string === "c") {
    send(
      `\nContents: \n ${Object.entries(get(simulatedMachines))
        .map(
          ([id, machine]) =>
            `${symbols[1]} ${MachineType[machine.machineType]} ${
              machine.machineType == MachineType.CORE
                ? `E: ${machine.energy}`
                : ""
            }`
        )
        .join("\n")}\n
        `
    )
  }

  /**
   * Show user a reward
   */
  if (string.startsWith("reward ")) {
    let art = `[${AsciiTextGenerator(args[0], "2").replaceAll(" ", "&nbsp;")}]`
    send(art)
  }

  /**
   * Inspect machines
   */
  if (string.startsWith("inspect ")) {
    if (args.length === 0) {
      send("What would you like to inspect?")
    } else {
      const numID = Number(args[0])
      const machine = Object.values($simulatedMachines).find(
        m => m.numericalID === numID
      )

      if (!machine) {
        send("Could not find that machine")
      } else {
        send(`${machine}`)
      }
    }
  }
}
