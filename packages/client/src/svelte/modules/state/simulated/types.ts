import { Product } from "../resolver/patches/types"
import { GRAPH_ENTITY_STATE } from "./enums"

type IntermediaryState = {
    depot?: boolean
    inputs?: Product[]
    outputs?: Product[],
    product: Product | null
    state: GRAPH_ENTITY_STATE
}

export type SimulatedEntity = Entity & IntermediaryState
export type SimulatedMachine = Machine & IntermediaryState
export type SimulatedDepot = Depot & IntermediaryState

export type SimulatedEntities = {
    [key: string]: SimulatedEntity
}

export type SimulatedMachines = {
    [key: string]: SimulatedMachine
}

export type SimulatedDepots = {
    [key: string]: SimulatedDepot
}

export type Connection = {
    id: string
    sourceMachine: string
    targetMachine: string
    portIndex: {
        source: number
        target: number
    }
    product: Product | null
    state: GRAPH_ENTITY_STATE
}