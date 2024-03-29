import { MACHINE_TYPE, PORT_INDEX } from "../state/base/enums"
import { addToSequencer } from "./actionSequencer"

export enum WorldFunctions {
  Spawn = "spawn",
  Start = "start",
  Connect = "connect",
  Disconnect = "disconnect",
  Build = "build",
  Destroy = "destroy",
  Name = "name",
  AttachDepot = "attachDepot",
  DetachDepot = "detachDepot",
  EmptyDepot = "emptyDepot",
  Ship = "ship",
  Accept = "accept",
  Unaccept = "unaccept",
  Buy = "buy",
  Reset = "reset",
  // Testing
  Resolve = "resolve",
  Reward = "reward",
  Charge = "charge",
  Graduate = "graduate",
}

// --- API --------------------------------------------------------------

export function spawn() {
  return addToSequencer(WorldFunctions.Spawn, [])
}

export function start() {
  return addToSequencer(WorldFunctions.Start, [])
}

export function connect(
  sourceMachine: string,
  targetMachine: string,
  portIndex: PORT_INDEX
) {
  return addToSequencer(WorldFunctions.Connect, [
    sourceMachine,
    targetMachine,
    portIndex
  ])
}

export function disconnect(sourceMachine: string, portIndex: PORT_INDEX) {
  return addToSequencer(WorldFunctions.Disconnect, [sourceMachine, portIndex])
}

export function build(machineType: MACHINE_TYPE) {
  return addToSequencer(WorldFunctions.Build, [machineType])
}

export function destroy(machineEntity: string) {
  return addToSequencer(WorldFunctions.Destroy, [machineEntity])
}

export function resolve() {
  return addToSequencer(WorldFunctions.Resolve, [])
}

export function reset() {
  return addToSequencer(WorldFunctions.Reset, [])
}

export function name(name: string) {
  return addToSequencer(WorldFunctions.Name, [name])
}

export function attachDepot(depotEntity: string, targetEntity: string) {
  return addToSequencer(WorldFunctions.AttachDepot, [
    depotEntity,
    targetEntity
  ])
}

export function detachDepot(depotEntity: string) {
  return addToSequencer(WorldFunctions.DetachDepot, [depotEntity])
}

export function emptyDepot(depotEntity: string) {
  return addToSequencer(WorldFunctions.EmptyDepot, [depotEntity])
}

export function ship(depotEntity: string) {
  return addToSequencer(WorldFunctions.Ship, [depotEntity])
}

export function accept(orderEntity: string) {
  return addToSequencer(WorldFunctions.Accept, [orderEntity])
}
export function unaccept() {
  return addToSequencer(WorldFunctions.Unaccept, [])
}

export function buy(offerEntity: string) {
  return addToSequencer(WorldFunctions.Buy, [offerEntity])
}

// ...

export function reward() {
  return addToSequencer(WorldFunctions.Reward, [])
}

export function charge() {
  return addToSequencer(WorldFunctions.Charge, [])
}

export function graduate() {
  return addToSequencer(WorldFunctions.Graduate, [])
}