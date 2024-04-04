import { EMPTY_CONNECTION } from "@modules/utils/constants"
import { MACHINE_TYPE, MATERIAL_TYPE } from "../base/enums"
import { DIRECTION } from "@components/Main/Terminal/enums"
import type { SimulatedMachines } from "./types"

export const availableMachines = (
  direction: DIRECTION,
  simulatedMachines: SimulatedMachines
) => {
  const machines = Object.entries(simulatedMachines)

  let availableMachines = []

  const connectionKey =
    direction === DIRECTION.OUTGOING
      ? "outgoingConnections"
      : "incomingConnections"

  for (let i = 0; i < machines.length; i++) {
    // The machines does not take connections of the given direction at all
    if (!machines[i][1][connectionKey]) continue

    // If the machine has an empty connection, it is available
    if (
      machines[i][1][connectionKey].some(
        connection => connection === EMPTY_CONNECTION
      )
    ) {
      availableMachines.push(machines[i])
    }
  }

  return availableMachines
}

export const availablePorts = (machine: Machine, direction: DIRECTION) => {
  let portAddresses =
    machine[
      direction === DIRECTION.OUTGOING
        ? "outgoingConnections"
        : "incomingConnections"
    ]
  let ports = portAddresses.map((address, i) => ({
    portIndex: i,
    machine,
    address,
  }))
  ports = ports.filter(connection => connection.address === EMPTY_CONNECTION)
  ports = ports.flat()
  return ports
}

export function machineTypeToLabel(machineType: MACHINE_TYPE | undefined) {
  if (!machineType) return ""
  switch (machineType || MACHINE_TYPE.NONE) {
    case MACHINE_TYPE.INLET:
      return "INLET"
    case MACHINE_TYPE.OUTLET:
      return "OUTLET"
    case MACHINE_TYPE.PLAYER:
      return "YOU"
    default:
      return MACHINE_TYPE[machineType]
  }
}

export function machineTypeToActionVerbs(
  machineType: MACHINE_TYPE | undefined
) {
  if (!machineType) return ""
  const name = MACHINE_TYPE[machineType]
  const map = {
    NONE: [""],
    INLET: [""],
    OUTLET: [""],
    PLAYER: ["PISSING", "BLEEDING"],
    SPLITTER: ["SPLITTING"],
    MIXER: ["MIXING"],
    DRYER: ["DRYING", "PARCHING"],
    BOILER: ["BOILING", "BROILING"],
    CENTRIFUGE: ["SPINNING", "TURNING", "WHIRLING"],
    GRINDER: ["GRINDING", "SCREECHING"],
    RAT_CAGE: [""],
    MEALWORM_VAT: [""],
  }

  if (map[name]) return map[name]

  return ""
}

export const materialTypeToLabel = (materialType: MATERIAL_TYPE) => {
  return MATERIAL_TYPE[materialType]?.split("_")?.join(" ")
}
