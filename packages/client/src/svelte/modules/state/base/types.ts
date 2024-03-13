import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "./enums"

declare global {
  // * * * * * * * * * * * * * * * * *
  // DEFAULT ENTITY TYPE
  // * * * * * * * * * * * * * * * * *

  type Entity = {
    [key: string]: any
    gameConfig?: GameConfig
    entityType?: ENTITY_TYPE
    machineType?: MACHINE_TYPE
    materialType?: MATERIAL_TYPE
    amount?: number
    name?: string
    carriedBy?: string
    buildIndex?: number
    buildTracker?: number[]
    spawnIndex?: number
    tutorial?: boolean
    tutorialLevel?: number
    tutorialOrders?: string[]
    order?: OrderData
    completed?: string[]
    earnedPoints?: number
    lastResolved?: number
    input?: number
    output?: MATERIAL_TYPE
    outgoingConnections?: string[] // ["0", "0"] or ["0"] or ["0xaed..."]
    incomingConnections?: string[]
    depotConnection?: string
    machinesInPod?: string[]
    depotsInPod?: string[]
    fixedEntities?: FixedEntities
    currentOrder?: string
    tokenBalances?: number
    recipe?: number
  }

  // * * * * * * * * * * * * * * * * *
  // GAME CONFIG ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type FixedEntities = {
    outlet: string
    inlets: string[]
  }

  type OrderData = {
    creationBlock: number
    expirationBlock: number
    resourceMaterialType: MATERIAL_TYPE
    resourceAmount: number
    goalMaterialType: MATERIAL_TYPE
    goalAmount: number
    rewardAmount: number
    maxPlayers: number
  }

  type GameConfig = {
    tokenAddress: string,
    globalSpawnIndex: number,
    scaleDown: number,
    flowRate: number
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Pod = {
    entityType: ENTITY_TYPE.POD
    lastResolved: number
    machinesInPod: string[]
    depotsInPod: string[]
    buildTracker: number[]
    currentOrder: string
    fixedEntities: FixedEntities
  }

  // aka. stump (fka. core)
  type Player = {
    entityType: ENTITY_TYPE.MACHINE
    machineType: MACHINE_TYPE.PLAYER
    spawnIndex: number
    name?: string
    carriedBy: string
    incomingConnections: string[]
    outgoingConnections: string[]
    tutorialLevel?: number
    tokenBalances?: number
    tutorial: boolean,
    completed: string[] // Orders completed by player
    earnedPoints: number
  }

  type Machine = {
    entityType: ENTITY_TYPE.MACHINE
    machineType: MACHINE_TYPE
    carriedBy: string
    buildIndex: number
    incomingConnections: string[]
    outgoingConnections: string[]
    depotConnection?: string // Only on inlet and outlet
  }

  type Depot = {
    entityType: ENTITY_TYPE.DEPOT,
    carriedBy: string
    amount: number
    materialType: MATERIAL_TYPE
    buildIndex: number
    depotConnection: string
  }

  type Order = {
    entityType: ENTITY_TYPE.ORDER
    order: OrderData
    tutorial?: boolean
    completed: string[] // Players that have completed the order
  }

  type Recipe = {
    machineType: number
    input: number
    output: number
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Entities = {
    [index: string]: Entity
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

  type Depots = {
    [index: string]: Depot
  }

  type Orders = {
    [index: string]: Order
  }
}
