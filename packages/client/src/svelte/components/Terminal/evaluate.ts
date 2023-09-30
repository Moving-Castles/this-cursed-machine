import AsciiTextGenerator from "ascii-text-generator"
import { get } from "svelte/store"
import { output, symbols } from "./index"
import { MachineType } from "../../modules/state/enums"
import { playerCore, playerEntityId } from "../../modules/state"
import { simulatedMachines } from "../../modules/simulator"
import { buildMachine, connectMachines } from "./actions"

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
      console.log(rect)
      rect.classList.remove("flash-a-little")
      setTimeout(() => {
        rect.classList.add("flash-a-little")
      }, 1)
    }
  }

  /**
   * Display help
   */
  if (string === "h" || string === "help")
    if (!get(output).join("").includes("please")) {
      send("Say please")
    } else {
      const commandList = `
      Commands:
      Inspect [id]  Inspect a machine
      Build         Create a machine
      Connect       Connect machines
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
   * Show build interface
   */
  if (string === "build") {
    // show an input
    return "build"
  }

  /**
   * Show connect interface
   */
  if (string === "connect") {
    // show an input
    return "connect"
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

  /**
   * Create pipes
   */
  if (string.startsWith("p ")) {
    // Add pipe
    if (args.length !== 2) {
      send(`! e: ${energy} Provide at least two arguments to add a pipe`)
    } else {
      if (energy <= 10) {
        send("Not enough energy. Building this would kill you. " + energy)
      }

      const source = Number(args[0])
      const target = Number(args[1])

      connectMachines(source, target, send)
    }
  }

  /**
   * Create machines
   */
  if (string.startsWith("m ")) {
    // Add machine
    if (args.length !== 1) {
      send(
        `@¥ Provide only one argument, which can be one of ${AVAILABLE_MACHINES.join(
          " "
        )}`
      )
    } else {
      const machineToBuild: string = args[0].toUpperCase()

      if (energy <= 20) {
        send("Not enough energy. Building this would kill you. " + energy)
      }
      if (!AVAILABLE_MACHINES.includes(machineToBuild)) {
        send(
          `$$$$ We don't have that machine in store... We do have ${
            AVAILABLE_MACHINES.join("s ") + "s"
          }`
        )
      } else {
        buildMachine(MachineType[machineToBuild], send)
      }
    }
  }

  /**
   * Remove pipes
   */
  if (string.startsWith("rp ")) {
    // Remove pipe
    send("We can't remove pipes yet. Come back later")
  }

  /**
   * Remove machines
   */
  if (string.startsWith("rm ")) {
    // Remove machine
    send("We can't remove machines yet. Come back later")
  }
}
