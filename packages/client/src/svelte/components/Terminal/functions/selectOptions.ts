import { SelectOption, COMMAND } from "../types"
import { MachineType, PortType } from "../../../modules/state/enums"
import { readableConnections } from "../../../modules/simulator"
import { connections, machines } from "../../../modules/state"
import { get } from "svelte/store"
import { FIXED_MACHINE_TYPES } from ".."
import { getMachinesWithAvailablePorts } from "./helpers"

/**
 * Generates select options based on the provided command type and port type.
 * @param {COMMAND} commandType - The type of command for which the select options are generated.
 * @param {PortType} [portType] - Optional. The type of port, used especially when the command type is `COMMAND.CONNECT`.
 * @returns {SelectOption[]} An array of select options appropriate for the given command and port type.
 */
export function createSelectOptions(
  commandType: COMMAND,
  portType: PortType = PortType.NONE
): SelectOption[] {
  switch (commandType) {
    case COMMAND.BUILD:
      return createSelectOptionsBuild()
    case COMMAND.DESTROY:
      return createSelectOptionsDestroy()
    case COMMAND.CONNECT:
      if (portType === PortType.NONE) {
        return [] as SelectOption[]
      } else {
        return createSelectOptionsConnect(portType)
      }
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
  // Options => all machine types except core, inlet, outlet
  let selectOptions: SelectOption[] = [
    {
      label: "Splitter",
      value: MachineType.SPLITTER,
    },
    {
      label: "Mixer",
      value: MachineType.MIXER,
    },
    {
      label: "Dryer",
      value: MachineType.DRYER,
    },
    {
      label: "Wetter",
      value: MachineType.WETTER,
    },
    {
      label: "Boiler",
      value: MachineType.BOILER,
    },
    {
      label: "Cooler",
      value: MachineType.COOLER,
    },
  ]
  return selectOptions
}

/**
 * Generates select options for destroying machines
 * This function returns select options for all machines, excluding the core, inlet, and outlet types.
 * @returns {SelectOption[]} An array of select options representing various machines to destroy, using their machine type as a label and their ID as the value.
 */
function createSelectOptionsDestroy(): SelectOption[] {
  let selectOptions: SelectOption[] = []

  // Options => all machines except core, inlet, outlet
  Object.entries(get(machines)).forEach(([machineId, machine]) => {
    if (!FIXED_MACHINE_TYPES.includes(machine.machineType)) {
      selectOptions.push({
        label: MachineType[machine.machineType],
        value: machineId,
      })
    }
  })

  return selectOptions
}

/**
 * Generates select options for disconnecting existing connections.
 * This function returns select options for all available connections.
 * @returns {SelectOption[]} An array of select options representing various connections to disconnect, using a generic "Connection" label and the connection ID as the value.
 */
function createSelectOptionsDisconnect(): SelectOption[] {
  let selectOptions: SelectOption[] = []

  get(readableConnections).forEach(({ id, label }) => {
    selectOptions.push({
      label,
      value: id,
    })
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

  // Options => all machines
  Object.entries(get(machines)).forEach(([machineId, machine]) => {
    selectOptions.push({
      label: MachineType[machine.machineType],
      value: machineId,
    })
  })

  return selectOptions
}

/**
 * Creates an array of select options based on machines with available ports of a specified type.
 * @param {PortType} portType - The type of port to look for (e.g., 'input', 'output').
 * @returns {SelectOption[]} An array of select options containing machine types as labels and machine IDs as values.
 */
function createSelectOptionsConnect(portType: PortType): SelectOption[] {
  let selectOptions: SelectOption[] = []

  // Get all machines with available ports of type
  const machines = getMachinesWithAvailablePorts(portType)

  Object.entries(machines).forEach(([machineId, machine]) => {
    selectOptions.push({
      label: MachineType[machine?.machineType || MachineType.NONE],
      value: machineId,
    })
  })

  return selectOptions
}
