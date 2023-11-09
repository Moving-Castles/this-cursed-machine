import type { SimulatedEntity } from "../simulator/types"
import { EMPTY_CONNECTION } from "./index"
import { EntityType, MaterialType, MachineType } from "./enums"
export { EntityType, MaterialType, MachineType } from "./enums"

declare global {
  // * * * * * * * * * * * * * * * * *
  // DEFAULT ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Entity = {
    [key: string]: any
    entityType?: EntityType
    machineType?: MachineType
    materialType?: MaterialType
    name?: string
    energy?: number
    carriedBy?: string
    createdBy?: string
    amount?: number
    creationBlock?: number
    buildIndex?: number
    level?: number
    lastResolved?: number
    input?: number
    output?: MaterialType
    outgoingConnections?: string[] // ["0", "0"] or ["0"] or ["0xaed..."]
    incomingConnections?: string[] // try to base everything off of the outgoing connections
    machinesInPod?: string[]
    materialsInPod?: string[]
    LevelStartBlock?: number
    completionTimes?: number[]
    outletEntity?: string
    gameConfig?: GameConfig
  }

  // * * * * * * * * * * * * * * * * *
  // GAME CONFIG ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type GameConfig = {
    coolDown: number
    connectionCost: number
    buildCost: number
  }

  type Level = {
    entityType: EntityType.LEVEL
    level: number
    energy: number
  }

  type Recipe = {
    entityType: EntityType.RECIPE
    machineType: MachineType
    input: number
    output: MaterialType
  }

  type Goal = {
    entityType: EntityType.GOAL
    level: number
    materialType: MaterialType
    amount: number
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  // aka. pod
  type Box = {
    entityType: EntityType.BOX
    creationBlock: number
    lastResolved: number
    outletEntity: string
    machinesInPod: string[]
    materialsInPod: string[]
  }

  // aka. stump
  type Core = {
    entityType: EntityType.MACHINE
    machineType: MachineType.CORE
    creationBlock: number
    name?: string
    energy: number
    level: number
    carriedBy: string
    incomingConnections: string[]
    outgoingConnections: string[]
    LevelStartBlock: number
    completionTimes: number[]
  }

  type Machine = {
    entityType: EntityType.MACHINE
    machineType: MachineType
    carriedBy: string
    buildIndex: number
    incomingConnections: string[]
    outgoingConnections: string[]
  }

  type Material = {
    entityType: EntityType.MATERIAL
    creationBlock: number
    carriedBy: string
    createdBy: string
    materialType: MaterialType
    amount: number
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Entities = {
    [index: string]: Entity
  }

  type Levels = {
    [index: string]: Level
  }

  type Recipes = {
    [index: string]: Recipe
  }

  type Goals = {
    [index: string]: Goal
  }

  type Cores = {
    [index: string]: Core
  }

  type Machines = {
    [index: string]: Machine
  }

  type Boxes = {
    [index: string]: Box
  }

  type Materials = {
    [index: string]: Material
  }

  // * * * * * * * * * * * * * * * * *
  // MISC TYPES
  // * * * * * * * * * * * * * * * * *

  type Coord = {
    x: number
    y: number
  }

  type PortDefinition = {
    portIndex: number
    machineAddress: string
    machine: SimulatedEntity
    address: typeof EMPTY_CONNECTION
  }
}
