import { Connection, SimulatedMachine } from "@modules/state/simulated/types"
import { PLACEMENT_GROUP } from "./enums"

export type Coordinate = {
    x: number
    y: number
}

export type Position = {
    x: number
    y: number
    placementGroup: PLACEMENT_GROUP
}

export type GraphMachine = SimulatedMachine & Position

export type GraphMachines = {
    [key: string]: GraphMachine
}

export type Path = {
    path: number[][]
}

export type GraphConnection = Connection & Path