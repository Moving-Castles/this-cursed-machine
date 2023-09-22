import { MachineType, ConnectionType } from "../../modules/state/enums"
import {
  ports,
  inputs as inputsStore,
  outputs as outputsStore,
  machines as machinesStore,
} from "../../modules/state"
import { showFlowChart } from "../../modules/ui/stores"
import { portSelection } from "../../modules/ui/paths"
import { writable, get } from "svelte/store"
import { build, connect } from "../../modules/action"
import { isNumeric } from "../../modules/utils/misc"

const machinesNames = Object.entries(MachineType).slice(
  0,
  Math.floor(Object.values(MachineType).length / 2)
)

/**
 * Core >::)
 */
export const index = writable(-1)
export const sequence = writable([])
export const output = writable([])

/**
 * REGEXES
 */
export const betweenSquareBrackets = /(?<=\[).+?(?=\])/g
export const betweenBrackets = /(?<=\().+?(?=\))/g
export const betweenCarets = /(?<=\>).+?(?=\<)/g

export const spanner = (string: string) => {
  return string
    .split("")
    .map(char => `<span>${char}</span>`)
    .join("")
}

/**
 * Returns a parsed string.
 *
 * Everything between brackets becomes an action based on the content of what's between those brackets
 * @param string
 * @returns
 */
export const parsed = (string: string) => {
  // console.log('parse: ', string)
  // Replace all actions
  const parsed = string
    .split("\n")
    .map(s => {
      return s.replaceAll(
        betweenCarets,
        match => `<span class="aim">${spanner(match)}</span>`
      )
    })
    .map(s => {
      return s.replaceAll(
        betweenSquareBrackets,
        match => `<span class="flash">${spanner(match)}</span>`
      )
    })
    .map(s => {
      return s.replaceAll(
        betweenBrackets,
        match => `<span class="race">${spanner(match)}</span>`
      )
    })
    .join("\n")
  return parsed
}

/**
 *
 * @param string String
 */
export const advance = (string: string) => {
  sequence.set([...get(sequence), parsed(string)])
  index.set(get(index) + 1)
}

/** Clicking an inline action */
export const handleClick = e =>
  handleAction(
    e.currentTarget.dataset.action,
    e.currentTarget.dataset.args.split()
  )

/**
 *
 * @param e Click event
 */
export const handleAction = (action: string, args: string[]) => {
  const machines = get(machinesStore)
  const inputs = Object.entries(get(inputsStore))
  const outputs = Object.entries(get(outputsStore))

  switch (action) {
    case "Add":
      if (args[0] === "machine") {
        advance(
          `Build a ${args[0]}:\n${machinesNames
            .map(([index, mach]) => `(New ${mach}) [${index}] `)
            .join("\n")}`
        )
      } else {
        advance(
          outputs
            .map(([add, port]) => {
              const fromMachine = machines[port.carriedBy]
              return `(From ${MachineType[fromMachine.machineType]}) [${add}]`
            })
            .join("\n")
        )
      }
      break

    case "New":
      let arg = args[0]

      if (isNumeric(arg)) arg = Number(arg)

      if (Object.values(MachineType).includes(arg)) {
        const numArg = isNaN(arg) ? MachineType[arg] : arg
        const textArg = !isNaN(arg) ? MachineType[arg] : arg

        build(numArg, 0, 0)
        advance("Building a " + textArg)
      }
      break

    case "Flowchart":
      showFlowChart.set(true)
      break

    case "From":
      portSelection.set([args[0]])
      advance(
        inputs
          .map(([add, port]) => {
            const toMachine = machines[port.carriedBy]
            return `(To ${MachineType[toMachine.machineType]}) [${add}]`
          })
          .join("\n")
      )
      break
    case "To":
      // console.log(args[0])
      let selection = get(portSelection)
      portSelection.set([...selection, args[0]])
      selection = get(portSelection)

      connect(ConnectionType.RESOURCE, selection[0], selection[1])
      advance(`Building a pipe from ${selection[0]} to ${selection[1]}`)

      setTimeout(() => {
        advance("Type [f] to see your box")
      }, 1000)

      break
    default:
      break
  }
}
