import { Hex } from "viem";
import { ENTITY_TYPE, MACHINE_TYPE } from "./enums"

declare global {
  // * * * * * * * * * * * * * * * * *
  // MATERIAL ID
  // * * * * * * * * * * * * * * * * *

  type MaterialId = Hex;

  // * * * * * * * * * * * * * * * * *
  // DEFAULT ENTITY TYPE
  // * * * * * * * * * * * * * * * * *

  type Entity = {
    [key: string]: any
    gameConfig?: GameConfig
    entityType?: ENTITY_TYPE
    machineType?: MACHINE_TYPE
    materialId?: MaterialId
    amount?: number
    name?: string
    carriedBy?: string
    buildIndex?: number
    buildTracker?: number[]
    spawnIndex?: number
    tutorial?: boolean
    tutorialLevel?: number
    nonTransferableBalance?: number
    order?: OrderData
    offer?: OfferData
    completed?: string[]
    producedMaterials?: MaterialId[]
    lastResolved?: number
    input?: number
    output?: MaterialId
    outgoingConnections?: string[] // ["0", "0"] or ["0"] or ["0xaed..."]
    incomingConnections?: string[]
    tankConnection?: string
    machinesInPod?: string[]
    tanksInPod?: string[]
    fixedEntities?: FixedEntities
    currentOrder?: string
    tokenBalances?: number
    recipe?: {
      outputs: number[]
    }
  }

  // * * * * * * * * * * * * * * * * *
  // GAME CONFIG ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type FixedEntities = {
    outlet: string
    inlets: string[]
  }

  type OrderData = {
    creator: string
    title: string
    expirationBlock: number
    materialId: MaterialId
    amount: number
    reward: number
    maxPlayers: number
  }

  type OfferData = {
    creationBlock: number
    materialId: MaterialId
    amount: number
    cost: number
  }

  type GameConfig = {
    adminAddress: string,
    globalSpawnIndex: number,
    scaleDown: number,
    flowRate: number,
    tankCapacity: number,
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Pod = {
    entityType: ENTITY_TYPE.POD
    lastResolved: number
    machinesInPod: string[]
    tanksInPod: string[]
    buildTracker: number[]
    fixedEntities: FixedEntities
  }

  // aka. stump (fka. core)
  type Player = {
    entityType: ENTITY_TYPE.MACHINE
    machineType: MACHINE_TYPE.PLAYER
    spawnIndex: number
    name?: string
    carriedBy: string
    currentOrder: string
    incomingConnections: string[]
    outgoingConnections: string[]
    tutorialLevel?: number
    nonTransferableBalance?: number // During tutorial we give players a non-transferable token substitute
    tokenBalances?: number
    tutorial: boolean,
    completed?: string[] // Orders completed by player
    producedMaterials?: MaterialId[]
  }

  type Machine = {
    entityType: ENTITY_TYPE.MACHINE
    machineType: MACHINE_TYPE
    carriedBy: string
    buildIndex: number
    incomingConnections: string[]
    outgoingConnections: string[]
    tankConnection?: string // Only on inlet and outlet
  }

  type Tank = {
    entityType: ENTITY_TYPE.TANK,
    carriedBy: string
    amount: number
    materialId: MaterialId
    buildIndex: number
    tankConnection: string
  }

  type Order = {
    entityType: ENTITY_TYPE.ORDER
    order: OrderData
    tutorial?: boolean
    tutorialLevel?: number
    completed: string[] // Players that have completed the order
  }

  type Offer = {
    entityType: ENTITY_TYPE.OFFER
    offer: OfferData
  }

  type Recipe = {
    machineType: number
    input: string
    outputs: MaterialId[]
  }

  type MaterialMetadata = {
    materialId: MaterialId
    tokenAddress: string
    difficultyCoefficient: number[]
    name: string
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

  type Tanks = {
    [index: string]: Tank
  }

  type Orders = {
    [index: string]: Order
  }

  type Offers = {
    [index: string]: Offer
  }
}
