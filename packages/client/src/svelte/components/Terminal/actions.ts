import { EntityType, MachineType } from "../../modules/state/enums"
import { machinePorts } from "../../modules/state/convenience"
import { simulated } from "../../modules/simulator"
import { get } from "svelte/store"
import { build, connect, disconnect, destroy } from "../../modules/action"

// Build
export const buildMachine = (machineType: string, send: Function) => {
  // First add the potential transaction
  const action = build(MachineType[machineType])
  send(`Building a ${machineType}`)
  // Wait for the result of the action
  return action
}

// Connect
export const connectMachines = (
  source: string,
  target: string,
  send: Function
) => {
  let action = null

  const $simulated = get(simulated)

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
      send("Only connect machines")
    } else {
      const [_, sourcePorts] = machinePorts(sourceMachine[1].numericalID)
      const [__, targetPorts] = machinePorts(targetMachine[1].numericalID)

      if (sourcePorts.length > 0 && targetPorts.length > 0) {
        // Connect the first available port
        action = connect(sourcePorts[0][0], targetPorts[0][0])
      } else {
        send("Ports occupied.")
      }
    }
  }
  return action
}

export const destroyMachine = (machineId: string) => {
  return destroy(machineId)
}

export const disconnectMachines = (connectionId: string) => {
  return disconnect(connectionId)
}
