import { get } from "svelte/store"
import { EMPTY_CONNECTION } from "@modules/utils/constants"
import { SelectOption } from "@components/Main/Terminal/types"
import { COMMAND, DIRECTION } from "@components/Main/Terminal/enums"
import { MACHINE_TYPE } from "@modules/state/base/enums"
import {
  simulatedMachines,
  simulatedConnections,
} from "@modules/state/simulated/stores"
import { player, depots as depotsStore } from "@modules/state/base/stores"
import { FIXED_MACHINE_TYPES, MACHINES_BY_LEVEL } from "@components/Main/Terminal/"
import { connectionMachineSort } from "@components/Main/Terminal/functions/helpers"
import {
  machineTypeToLabel,
  materialTypeToLabel,
  availableMachines,
} from "@modules/state/simulated"

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
    case COMMAND.ATTACH_DEPOT:
      return createSelectOptionsAttachDepot()
    case COMMAND.DETACH_DEPOT:
      return createSelectOptionsDetachDepot()
    case COMMAND.EMPTY_DEPOT:
      return createSelectOptionsEmptyDepot()
    case COMMAND.FILL:
      return createSelectOptionsFill()
    default:
      return [] as SelectOption[]
  }
}

/**
 * Generates select options for building machine types.
 * This function returns select options for all machine types except player, inlet, and outlet.
 * @returns {SelectOption[]} An array of select options representing various machine types.
 */
function createSelectOptionsBuild(): SelectOption[] {
  let selectOptions: SelectOption[] = []
  let availableMachines: MACHINE_TYPE[] =
    MACHINES_BY_LEVEL[get(player)?.tutorialLevel || 0]

  for (let i = 0; i < availableMachines.length; i++) {
    selectOptions.push({
      label: MACHINE_TYPE[availableMachines[i]],
      value: availableMachines[i],
    })
  }

  return selectOptions
}

/**
 * Generates select options for destroying machines
 * This function returns select options for all machines, excluding the player, inlet, and outlet types.
 * @returns {SelectOption[]} An array of select options representing various machines to destroy, using their machine type as a label and their ID as the value.
 */
function createSelectOptionsDestroy(): SelectOption[] {
  let selectOptions: SelectOption[] = []

  // All machines except player, inlet, outlet
  Object.entries(get(simulatedMachines)).forEach(([machineId, machine]) => {
    if (
      !FIXED_MACHINE_TYPES.includes(machine.machineType || MACHINE_TYPE.NONE)
    ) {
      selectOptions.push({
        label: `${machineTypeToLabel(machine.machineType)} #${machine.buildIndex}`,
        value: machineId,
      })
    }
  })

  return selectOptions
}

/**
 * Creates an array of select options based on machines with available ports of a specified type.
 * @returns {SelectOption[]} An array of select options containing machine types as labels and machine IDs as values.
 */
function createSelectOptionsConnect(direction: DIRECTION): SelectOption[] {
  let selectOptions: SelectOption[] = []

  const machines = availableMachines(direction, get(simulatedMachines))

  selectOptions = machines.map(([address, machine]) => ({
    label: machineTypeToLabel(machine.machineType) + (machine.hasOwnProperty("buildIndex") ? " #" + machine.buildIndex : ""),
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

    const sourceMachineBuildIndex = sourceMachine.hasOwnProperty("buildIndex") ? "#" + sourceMachine.buildIndex : ""
    const targetMachineBuildIndex = targetMachine.hasOwnProperty("buildIndex") ? "#" + targetMachine.buildIndex : ""
    const connectionProduct = connection?.product ? `(${materialTypeToLabel(connection.product.materialType)})` : ""

    const label = `${machineTypeToLabel(sourceMachine.machineType)}${sourceMachineBuildIndex} to ${machineTypeToLabel(targetMachine.machineType)}${targetMachineBuildIndex} ${connectionProduct}`

    return {
      label,
      value: connection.id,
    }
  })

  return selectOptions
}

function createSelectOptionsAttachDepot(): SelectOption[] {
  let selectOptions: SelectOption[] = [];

  const depots = get(depotsStore);

  // Only depots that are not attached can be attached
  selectOptions = Object.entries(depots)
    .filter(([_, depotDetails]) => depotDetails.depotConnection === EMPTY_CONNECTION)
    .map(([address, depot]) => ({
      label: `Depot #${depot.buildIndex}`,
      value: address,
    }));

  return selectOptions;
}

function createSelectOptionsDetachDepot(): SelectOption[] {

  let selectOptions: SelectOption[] = []

  const depots = get(depotsStore)

  // Only depots that are attached can be detached 
  selectOptions = Object.entries(depots)
    .filter(([_, depot]) => depot.depotConnection !== EMPTY_CONNECTION)
    .map(([address, depot]) => ({
      label: `Depot #${depot.buildIndex}`,
      value: address,
    }))

  return selectOptions
}

function createSelectOptionsEmptyDepot(): SelectOption[] {
  let selectOptions: SelectOption[] = [];

  const depots = get(depotsStore);

  // Only depots that are not attached be emptied
  selectOptions = Object.entries(depots)
    .filter(([_, depotDetails]) => depotDetails.depotConnection === EMPTY_CONNECTION)
    .map(([address, depot]) => ({
      label: `Depot #${depot.buildIndex}`,
      value: address,
    }));

  return selectOptions;
}

function createSelectOptionsFill(): SelectOption[] {
  let selectOptions: SelectOption[] = []

  const depots = get(depotsStore)

  selectOptions = Object.entries(depots)
    .map(([address, depot]) => ({
      label: `Depot #${depot.buildIndex}`,
      value: address,
    }))

  return selectOptions
}