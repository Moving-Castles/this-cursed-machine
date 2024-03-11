import { Product } from "../resolver/patches/types"

type IntermediaryState = {
    depot?: boolean
    inputs?: Product[]
    outputs?: Product[]
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
    portIndex: number
    product?: Product
}