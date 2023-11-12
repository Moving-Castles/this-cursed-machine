import type { PortDefinition } from "../../../modules/state/types"
import { SelectOption, COMMAND, DIRECTION } from "../types"
import { MachineType } from "../../../modules/state/enums"
import {
  simulatedMachines,
  simulatedConnections,
} from "../../../modules/simulator"
import { playerCore } from "../../../modules/state"
import { get } from "svelte/store"
import { FIXED_MACHINE_TYPES, MACHINES_BY_LEVEL } from ".."
import { connectionMachineSort } from "./helpers"
import {
  machineTypeToLabel,
  materialTypeToLabel,
  availableMachines,
} from "../../../modules/state/convenience"

/**
 * Generates select options based on the provided command type and port type.
 * @param {COMMAND} commandType - The type of command for which the select options are generated.
 * @returns {SelectOption[]} An array of select options appropriate for the given command and port type.
 */
export function createSelectOptions(
  commandType: COMMAND,
  direction: DIRECTION = DIRECTION.OUTGOING
): SelectOption[] {
  switch (commandType) {
    case COMMAND.BUILD:
      return createSelectOptionsBuild()
    case COMMAND.DESTROY:
      return createSelectOptionsDestroy()
    case COMMAND.CONNECT:
      return createSelectOptionsConnect(direction)
    case COMMAND.DISCONNECT:
      return createSelectOptionsDisconnect()
    case COMMAND.INSPECT:
      return createSelectOptionsInspect()
    default:
      return [] as SelectOption[]
  }
}

/**
 * Generates select options for building machine types.
 * This function returns select options for all machine types except core, inlet, and outlet.
 * @returns {SelectOption[]} An array of select options representing various machine types.
 */
function createSelectOptionsBuild(): SelectOption[] {
  let selectOptions: SelectOption[] = []
  let availableMachines: MachineType[] =
    MACHINES_BY_LEVEL[get(playerCore)?.level || 0]

  for (let i = 0; i < availableMachines.length; i++) {
    selectOptions.push({
      label: MachineType[availableMachines[i]],
      value: availableMachines[i],
    })
  }

  return selectOptions
}

/**
 * Generates select options for destroying machines
 * This function returns select options for all machines, excluding the core, inlet, and outlet types.
 * @returns {SelectOption[]} An array of select options representing various machines to destroy, using their machine type as a label and their ID as the value.
 */
function createSelectOptionsDestroy(): SelectOption[] {
  let selectOptions: SelectOption[] = []

  // All machines except core, inlet, outlet
  Object.entries(get(simulatedMachines)).forEach(([machineId, machine]) => {
    if (
      !FIXED_MACHINE_TYPES.includes(machine.machineType || MachineType.NONE)
    ) {
      selectOptions.push({
        label: `${machineTypeToLabel(machine.machineType)} #${machine.buildIndex
          }`,
        value: machineId,
      })
    }
  })

  return selectOptions
}

/**
 * Generates select options for inspecting machines
 * This function returns select options for all machines
 * @returns {SelectOption[]} An array of select options representing various machines to inspect, using their machine type as a label and their ID as the value.
 */
function createSelectOptionsInspect(): SelectOption[] {
  let selectOptions: SelectOption[] = []

  // All machines
  Object.entries(get(simulatedMachines)).forEach(([machineId, machine]) => {
    selectOptions.push({
      label:
        machineTypeToLabel(machine.machineType) +
        (machine.buildIndex ? " #" + machine.buildIndex : ""),
      value: machineId,
    })
  })

  return selectOptions
}

/**
 * Creates an array of select options based on machines with available ports of a specified type.
 * @returns {SelectOption[]} An array of select options containing machine types as labels and machine IDs as values.
 */
function createSelectOptionsConnect(direction: DIRECTION): SelectOption[] {
  let selectOptions: SelectOption[] = []

  const machines = availableMachines(direction)

  selectOptions = machines.map(([address, machine]) => ({
    label: machineTypeToLabel(machine.machineType) + (machine.buildIndex ? "#" + machine.buildIndex : ""),
    value: address,
  }))

  return connectionMachineSort(selectOptions)
}

/**
 * Generates select options for disconnecting existing connections.
 * This function returns select options for all available connections.
 * @returns {SelectOption[]} An array of select options representing various connections to disconnect, using a generic "Connection" label and the connection ID as the value.
 */
function createSelectOptionsDisconnect(): SelectOption[] {
  let selectOptions: SelectOption[] = []

  const machines = get(simulatedMachines)
  const connections = get(simulatedConnections)

  selectOptions = connections.map(connection => {
    const sourceMachine = machines[connection.sourceMachine]
    const targetMachine = machines[connection.targetMachine]
    const label = `${machineTypeToLabel(sourceMachine.machineType)
      } ${sourceMachine?.buildIndex ?? ""
      } to ${machineTypeToLabel(targetMachine.machineType)} ${targetMachine?.buildIndex ?? ""
      } ${connection?.product
        ? `(${materialTypeToLabel(connection.product.materialType)})`
        : ""
      } `

    return {
      label,
      value: connection.id,
    }
  })

  return selectOptions
}
