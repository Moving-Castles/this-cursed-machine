import { Connection, SimulatedMachine } from "@modules/state/simulated/types"
import type { ElkExtendedEdge, ElkNode } from "elkjs"

export type Position = {
    elkNode: ElkNode
}

export type GraphMachine = SimulatedMachine & Position

export type GraphMachines = {
    [key: string]: GraphMachine
}

export type Path = {
    elkEdge: ElkExtendedEdge
}

export type GraphConnection = Connection & Path

type elkGraphNode = {
    id: string
    width: number
    height: number
}

type elkGraphEdge = {
    id: string
    sources: string[]
    targets: string[]
}

export type elkGraph = {
    id: string
    layoutOptions: { [key: string]: string }
    children: elkGraphNode[]
    edges: elkGraphEdge[]
}