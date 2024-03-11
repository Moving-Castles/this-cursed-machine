import { Connection, SimulatedMachine } from "@modules/state/simulated/types"

export type Position = {
    x: number
    y: number
}

export type GraphMachine = SimulatedMachine & Position

export type GraphMachines = {
    [key: string]: GraphMachine
}

export type Path = {
    path: number[][]
}

export type GraphConnection = Connection & Path