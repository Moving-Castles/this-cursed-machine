<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte"
  import { playSound } from "../../modules/sound"
  import { onWheel } from "../../modules/ui/events"
  import { lastSentTime } from "../../modules/ui/stores"
  import { output, sequence as seq, index, parsed } from "./index"
  import AsciiTextGenerator from "ascii-text-generator"
  import Select from "./Select.svelte"
  import MultiSelect from "./MultiSelect.svelte"
  import {
    EntityType,
    MachineType,
    ConnectionType,
  } from "../../modules/state/enums"
  import { playerEntityId, playerCore, playerBox } from "../../modules/state"
  import {
    simulated,
    simulatedMachines,
    simulatedPorts,
    simulatedConnections,
  } from "../../modules/simulator"
  import { build, connect } from "../../modules/action"
  export let sequence: string[] = []
  export let speed = 80
  export let theme = "dark"
  export let placeholder = "Start typing"
  export let loop = false
  export let track = true
  export let input = false
  export let stage = true // display the terminal centered and front stage
  export let animated = false
  let machinesToConnect = {}

  const symbols = [
    "›",
    "»",
    "*",
    "+",
    "‡",
    "†",
    "+",
    "◊",
    "”",
    "%",
    "#",
    "«",
    "¥",
  ]

  /** Init */
  if (!input) seq.set(sequence)

  /** Constants */
  const dispatch = createEventDispatcher()
  const AVAILABLE_MACHINES = Object.values(MachineType).splice(
    0,
    Object.keys(MachineType).length / 2
  )

  /** Variables */
  let inputElement: HTMLElement
  let outputElement: HTMLElement
  let userInput = ""
  let building = false
  let connecting = false
  let skip = false

  /**
   * Build, connect and inspect functions
   */
  // Build
  const buildMachine = machineType => {
    build(MachineType[machineType], 0, 0)
    send(`Building a ${machineType}`)
  }

  // Connect
  const connectMachines = (source, target) => {
    const sourceMachine = Object.entries($simulated).find(
      ([_, ent]) => ent.numericalID === source
    )
    const targetMachine = Object.entries($simulated).find(
      ([_, ent]) => ent.numericalID === target
    )
    if (sourceMachine && targetMachine) {
      if (
        sourceMachine[1].entityType !== EntityType.MACHINE ||
        targetMachine[1].entityType !== EntityType.MACHINE
      ) {
        send("Please, only connect machines")
      } else {
        const connections = Object.values($simulated).filter(
          ent => ent.entityType === EntityType.CONNECTION
        )
        // Make sure there are ports we can connect
        const sourcePorts = Object.entries($simulated).filter(
          ([_, ent]) => ent?.carriedBy === sourceMachine[0]
        )
        const targetPorts = Object.entries($simulated).filter(
          ([_, ent]) => ent?.carriedBy === targetMachine[0]
        )

        const occupiedSourcePorts = sourcePorts.filter(([id, _]) => {
          // if a connection exists with this as source OR target, list as occupied
          const connectionsUsingPort = connections.filter(
            connection =>
              connection.sourcePort === id || connection.targetPort === id
          )
          return connectionsUsingPort.length > 0
        })
        const totalOccupiedSourcePorts = occupiedSourcePorts.length
        const totalAvailableSourcePorts =
          sourcePorts.length - totalOccupiedSourcePorts

        const occupiedTargetPorts = targetPorts.filter(([id, _]) => {
          // if a connection exists with this as source OR target, list as occupied
          const connectionsUsingPort = connections.filter(
            connection =>
              connection.sourcePort === id || connection.targetPort === id
          )
          return connectionsUsingPort.length > 0
        })
        const totalOccupiedTargetPorts = occupiedTargetPorts.length
        const totalAvailableTargetPorts =
          targetPorts.length - totalOccupiedTargetPorts

        if (totalAvailableSourcePorts > 0 && totalAvailableTargetPorts > 0) {
          // Connect the first available port
          connect(ConnectionType.RESOURCE, sourcePorts[0][0], targetPorts[0][0])
        } else {
          send("Ports occupied. Sawry")
        }
      }
    }
  }

  /**
   * Send stuff to the terminal
   */
  export const send = async (string: string, user = false) => {
    output.set([...$output, `${user ? `${symbols[2]} ` : ""}${string}`])
    lastSentTime.set(performance.now())

    await tick()

    dispatch("send", string)

    if (outputElement) {
      outputElement.scrollTop = outputElement.scrollTop + 10000
    }

    evaluate(string)
  }

  /**
   * Evaluate string output
   * @param string
   */
  const evaluate = (string: string) => {
    const args = string.split(" ").splice(1)

    string = string.toLowerCase()

    /**
     * Enter
     */
    if (string === "blink") {
      dispatch("done")
    }

    /**
     * Clear console
     */
    if (string === "clear") {
      output.set([])
    }

    /**
     * Highlight core in the graph
     */
    if (string === "whoami") {
      const rect = document.getElementById($playerEntityId)
      if (rect) {
        rect.classList.add("flash")
        setTimeout(() => rect.classList.remove("flash"), 7000)
      }
    }

    /**
     * Thanks for those who know the answer to life's secrets
     */
    if (string === "42") {
      const commandList = `
Commands:
Please ->         talk to Puppitywink
Pretty Please     get a favor
Inspect [id]      Inspect a machine
m [name]          Create a machine
p [from] [to]     Connect machines
      `
      // List all available commands
      send(commandList.replaceAll(" ", "&nbsp;"))
    }

    /**
     * Be very helpful
     */
    if (string === "pretty please") {
      send("OK.... ")
      setTimeout(() => {
        const helpMessage = `
Your machines are off to the right.

Did that help you?
`
        send(helpMessage.replaceAll(" ", "&nbsp;"))
      }, 10000)
      setTimeout(() => {
        const helpMessage = `
Calculate the answer of life to get more help ya dumwit
`
        send(helpMessage.replaceAll(" ", "&nbsp;"))
      }, 18000)
    }

    /**
     * Say please!
     */
    if (string === "please") {
      send("Now say pretty please")
    }

    /**
     * Display help
     */
    if (string === "h" || string === "help")
      if ($output.join("").includes("help")) {
        send("Say please")
      } else {
        send("GHAghahahahahahahaa ur on ur own")
      }

    /**
     * Show agreement
     */
    if (string === "read") {
      const agreement = `
      +_______________________________________+
      | Agreement between ${$playerCore.name} |
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
      building = true
    }

    /**
     * Show connect interface
     */
    if (string === "connect") {
      // show an input
      connecting = true
    }

    /**
     * List box contents
     */
    if (string === "contents" || string === "c") {
      send(
        `\nContents: \n ${Object.entries($simulatedMachines)
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
     * List user energy
     */
    if (string === "energy" || string === "nrg") send(`${energy}`)

    /**
     * Show user a reward
     */
    if (string.startsWith("reward ")) {
      let art = `[${AsciiTextGenerator(args[0], "2").replaceAll(
        " ",
        "&nbsp;"
      )}]`
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

        connectMachines(source, target)
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
          buildMachine(MachineType[machineToBuild])
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

  const onBuildConfirm = ({ detail }) => {
    building = false
    buildMachine(detail)
    userInput = ""
  }

  const onConnectConfirm = ({ detail }) => {
    console.log(detail)
    connectMachines(detail[0], detail[1])
    connecting = false
    userInput = ""
  }

  const onAdvance = ({ detail }) => {
    send("Connecting: " + detail)
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

  /** Reactive statements */
  // Key for transitions
  $: key = $index + (skip ? "-skip" : "")
  $: energy = $simulated[$playerEntityId]?.energy
  $: {
    machinesToConnect = Object.fromEntries(
      Object.entries($simulatedMachines).filter(filterByAvailablePorts)
    )
  }

  /** Lifecycle hooks */
  onMount(() => {
    inputElement.focus()
    $index = 0
  })

  onDestroy(() => index.set(-1))
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click={() => inputElement.focus()}
  use:onWheel
  class="terminal"
  class:stage
  bind:this={outputElement}
>
  {#if !input}
    {#if track}
      <p class="track">
        {$index} / {$seq.length}
      </p>
    {/if}
    {#key key}
      {#each $output as o, i (i)}
        <p class="output-content">
          {@html parsed(o)}
        </p>
      {/each}
    {/key}
  {/if}

  <form class="terminal-input" on:submit|preventDefault={onSubmit}>
    {#if building}
      <Select
        options={AVAILABLE_MACHINES}
        bind:value={userInput}
        on:confirm={onBuildConfirm}
      />
    {:else if connecting}
      <MultiSelect
        options={[
          Object.values(machinesToConnect).map(
            machine =>
              `${MachineType[machine.machineType]}: ${machine.numericalID}`
          ),
          Object.values(machinesToConnect).map(
            machine =>
              `${MachineType[machine.machineType]}: ${machine.numericalID}`
          ),
        ]}
        on:advance={onAdvance}
        on:confirm={onConnectConfirm}
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
  </form>
</div>

<style lang="scss">
  .terminal {
    font-family: var(--font-family);
    // padding: 0 1rem;
    overflow: hidden;
    transition: background 2s ease, color 2s ease;
    border: var(--terminal-border);
    color: var(--terminal-color);
    background: var(--terminal-background);
    width: 100%;
    position: relative;
    height: 100vh;
    white-space: pre-line;

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
