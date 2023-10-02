import { MachineType } from "./enums"

export const machineDefinitions: BuildableMachine[] = [
  {
    type: MachineType.NONE,
    name: "None",
    cost: 0 // frontend only
  },
  {
    type: MachineType.INLET,
    name: "INLET",
    cost: 200 // frontend only
  },
  {
    type: MachineType.OUTLET,
    name: "OUTLET",
    cost: 0 // frontend only
  },
  {
    type: MachineType.BLENDER,
    name: "BLENDER",
    cost: 0 // frontend only
  },
  {
    type: MachineType.SPLITTER,
    name: "SPLITTER",
    cost: 0 // frontend only
  },
  {
    type: MachineType.SCORCHER,
    name: "SCORCHER",
    cost: 0 // frontend only
  },
]