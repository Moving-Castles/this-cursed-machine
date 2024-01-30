import type { SimulatedEntity } from "../simulator/types"
import { EMPTY_CONNECTION } from "./index"
import { EntityType, MaterialType, MachineType } from "./enums"

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
    carriedBy?: string
    amount?: number
    creationBlock?: number
    buildIndex?: number
    spawnIndex?: number
    tutorialLevel?: number
    tutorial?: boolean
    lastResolved?: number
    input?: number
    output?: MaterialType
    outgoingConnections?: string[] // ["0", "0"] or ["0"] or ["0xaed..."]
    incomingConnections?: string[]
    storageConnection?: string
    machinesInPod?: string[]
    storageInPod?: string[]
    completionTimes?: number[]
    gameConfig?: GameConfig
    outletEntity?: string
    inletEntity?: string
    currentOrder?: string
  }

  // * * * * * * * * * * * * * * * * *
  // GAME CONFIG ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type GameConfig = {
    tokenAddress: string,
    globalSpawnIndex: number
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

  type Pod = {
    entityType: EntityType.POD
    creationBlock: number
    lastResolved: number
    machinesInPod: string[]
    storageInPod: string[]
    outletEntity: string
    inletEntity: string
    currentOrder: string
    tutorial: boolean
  }

  // aka. stump (fka. core)
  type Player = {
    entityType: EntityType.MACHINE
    machineType: MachineType.PLAYER
    creationBlock: number
    spawnIndex: number
    name?: string
    carriedBy: string
    incomingConnections: string[]
    outgoingConnections: string[]
    tutorialLevel?: number
  }

  type Machine = {
    entityType: EntityType.MACHINE
    machineType: MachineType
    carriedBy: string
    buildIndex: number
    incomingConnections: string[]
    outgoingConnections: string[]
    storageConnection?: string // Only on inlet and outlet
  }

  type Store = {
    entityType: EntityType.STORAGE,
    carriedBy: string
    amount: number
    materialType: MaterialType
    storageConnection: string
  }

  type Order = {
    materialType: EntityType.ORDER
    completedPlayers: string[]
  }

  type TutorialOrder = {
    materialType: EntityType.ORDER
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Entities = {
    [index: string]: Entity
  }

  type Recipes = {
    [index: string]: Recipe
  }

  type Goals = {
    [index: string]: Goal
  }

  type Players = {
    [index: string]: Player
  }

  type Machines = {
    [index: string]: Machine
  }

  type Pods = {
    [index: string]: Pod
  }

  type Storages = {
    [index: string]: Store
  }

  type Orders = {
    [index: string]: Order
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
