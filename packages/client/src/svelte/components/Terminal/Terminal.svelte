<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte"
  import { playSound } from "../../modules/sound"
  import { onWheel } from "../../modules/ui/events"
  import { output, sequence as seq, index, parsed } from "./index"
  import {
    EntityType,
    MachineType,
    ConnectionType,
  } from "../../modules/state/enums"
  import { playerEntityId } from "../../modules/state"
  import { simulated } from "../../modules/simulator"
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
  let skip = false

  const send = async (string: string) => {
    output.set([...$output, string])
    await tick()
    dispatch("send", string)
    if (outputElement) {
      outputElement.scrollTop = outputElement.scrollTop + 10000
    }
  }

  const evaluate = () => {
    const { energy } = $simulated[$playerEntityId]
    const args = userInput.split(" ").splice(1)

    // Show help
    if (userInput === "h" || userInput === "help")
      send("GHAghahahahahahahaa ur on ur own")
    // Show the graph
    if (userInput === "show" || userInput === "graph") dispatch("show")

    if (userInput === "energy" || userInput === "nrg") send(`${energy}`)
    if (userInput.startsWith("p ")) {
      // Add pipe
      if (args.length !== 2) {
        send(`! e: ${energy} Provide at least two arguments to add a pipe`)
      } else {
        if (energy <= 10) {
          send("Not enough energy. Building this would kill you. " + energy)
        }

        const source = Number(args[0])
        const target = Number(args[1])

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

            console.log(totalAvailableSourcePorts, totalAvailableTargetPorts)

            if (
              totalAvailableSourcePorts > 0 &&
              totalAvailableTargetPorts > 0
            ) {
              // Connect the first available port
              connect(
                ConnectionType.RESOURCE,
                sourcePorts[0][0],
                targetPorts[0][0]
              )
            } else {
              send("Ports occupied. Sawry")
            }
          }
        }
      }
    }
    if (userInput.startsWith("m ")) {
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
          build(MachineType[machineToBuild], 0, 0)
          send(`Building a ${machineToBuild}`)
        }
      }
    }
    if (userInput.startsWith("rp ")) {
      // Remove pipe
      send("We can't remove pipes yet. Come back later")
    }
    if (userInput.startsWith("rm ")) {
      // Remove machine
      send("We can't remove machines yet. Come back later")
    }
  }

  /** The submit function */
  const onSubmit = async () => {
    if (userInput === "") return
    send(`${symbols[2]} ${userInput}`)
    evaluate()
    playSound("ui", "selectFour")
    userInput = ""
  }

  /** Reactive statements */
  // Key for transitions
  $: key = $index + (skip ? "-skip" : "")

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
    height: 100%;

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

    * {
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
