import type { SimulatedEntity } from "../simulator/types"
import { EMPTY_CONNECTION } from "./index"
import { EntityType, MaterialType, MachineType } from "./enums"

declare global {
  // * * * * * * * * * * * * * * * * *
  // DEFAULT ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Entity = {
    [key: string]: any
    gameConfig?: GameConfig
    entityType?: EntityType
    machineType?: MachineType
    materialType?: MaterialType
    amount?: number
    name?: string
    carriedBy?: string
    buildIndex?: number
    spawnIndex?: number
    tutorial?: boolean
    tutorialLevel?: number
    tutorialOrders?: string[]
    order?: OrderData
    completedPlayers?: string[]
    lastResolved?: number
    input?: number
    output?: MaterialType
    outgoingConnections?: string[] // ["0", "0"] or ["0"] or ["0xaed..."]
    incomingConnections?: string[]
    storageConnection?: string
    machinesInPod?: string[]
    storageInPod?: string[]
    fixedEntities?: FixedEntities
    currentOrder?: string
  }

  // * * * * * * * * * * * * * * * * *
  // GAME CONFIG ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Recipe = {
    entityType: EntityType.RECIPE
    machineType: MachineType
    input: number
    output: MaterialType
  }

  type FixedEntities = {
    outlet: string
    inlets: string[]
  }

  type OrderData = {
    creationBlock: number
    resourceMaterialType: MaterialType
    resourceAmount: number
    goalMaterialType: MaterialType
    goalAmount: number
    rewardAmount: number
    maxPlayers: number
    duration: number
  }

  type GameConfig = {
    tokenAddress: string,
    globalSpawnIndex: number
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Pod = {
    entityType: EntityType.POD
    lastResolved: number
    machinesInPod: string[]
    storageInPod: string[]
    currentOrder: string
    fixedEntities: FixedEntities
  }

  // aka. stump (fka. core)
  type Player = {
    entityType: EntityType.MACHINE
    machineType: MachineType.PLAYER
    spawnIndex: number
    name?: string
    carriedBy: string
    incomingConnections: string[]
    outgoingConnections: string[]
    tutorialLevel?: number
    tutorial: boolean // True if player is in training
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
    entityType: EntityType.ORDER
    order: OrderData
    completedPlayers: string[]
  }

  type TutorialOrder = {
    entityType: EntityType.ORDER
    order: OrderData
    tutorial: true
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

  type TutorialOrders = {
    [index: string]: TutorialOrder
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
