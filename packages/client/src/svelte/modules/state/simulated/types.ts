import { Product } from "../resolver/patches/types"

export type Connection = {
    id: string
    sourceMachine: string
    targetMachine: string
    product: Product
}

type IntermediaryState = {
    depot?: boolean
    inputs?: Product[]
    outputs?: Product[]
}

export type SimulatedEntity = Entity & IntermediaryState

export type SimulatedEntities = {
    [key: string]: SimulatedEntity
}