import { MaterialType } from "../state/enums"

export type Product = {
  machineId: string
  materialType: MaterialType
  amount: number
}

export type Connection = {
  id: string
  sourceMachine: string
  targetMachine: string
  product: Product
}

type IntermediaryState = {
  inputs?: Product[]
  outputs?: Product[]
}

export type SimulatedEntity = Entity & IntermediaryState

export type SimulatedEntities = {
  [key: string]: SimulatedEntity
}

export type PodOutputs = {
  [key in MaterialType]: number
}
