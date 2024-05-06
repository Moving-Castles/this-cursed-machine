import { Hex } from "viem"
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_DIFFICULTY } from "./enums"

declare global {
  // * * * * * * * * * * * * * * * * *
  // MATERIAL ID
  // * * * * * * * * * * * * * * * * *

  type MaterialId = Hex

  // * * * * * * * * * * * * * * * * *
  // DEFAULT ENTITY TYPE
  // * * * * * * * * * * * * * * * * *

  type Entity = {
    [key: string]: any
    gameConfig?: GameConfig
    entityType?: ENTITY_TYPE
    machineType?: MACHINE_TYPE
    materialId?: MaterialId
    amount?: bigint
    name?: string
    carriedBy?: string
    buildIndex?: number
    buildTracker?: number[]
    spawnIndex?: number
    tutorial?: boolean
    tutorialLevel?: number
    nonTransferableBalance?: bigint
    order?: OrderData
    offer?: OfferData
    completedOrders?: string[]
    completedPlayers: number
    producedMaterials?: MaterialId[]
    lastResolved?: bigint
    outgoingConnections?: string[] // ["0", "0"] or ["0"] or ["0xaed..."]
    incomingConnections?: string[]
    tankConnection?: string
    machinesInPod?: string[]
    tanksInPod?: string[]
    fixedEntities?: FixedEntities
    currentOrder?: string
    tokenBalances?: bigint
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
    creationBlock: bigint
    expirationBlock: bigint
    materialId: MaterialId
    amount: bigint
    reward: bigint
    maxPlayers: number
  }

  type OfferData = {
    creationBlock: bigint
    materialId: MaterialId
    amount: bigint
    cost: bigint
  }

  type GameConfig = {
    adminAddress: string
    globalSpawnIndex: number
    flowRate: bigint
    tankCapacity: bigint
  }

  // * * * * * * * * * * * * * * * * *
  // GAME PLAY ENTITY TYPES
  // * * * * * * * * * * * * * * * * *

  type Pod = {
    entityType: ENTITY_TYPE.POD
    lastResolved: bigint
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
    nonTransferableBalance?: bigint // During tutorial we give players a non-transferable token substitute
    tokenBalances?: bigint
    tutorial: boolean
    completedOrders: string[] // Orders completed by player
    producedMaterials?: MaterialId[]
  }

  type PlayerNames = {
    [index: string]: string
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
    entityType: ENTITY_TYPE.TANK
    carriedBy: string
    amount: bigint
    materialId: MaterialId
    buildIndex: number
    tankConnection: string
  }

  type Order = {
    entityType: ENTITY_TYPE.ORDER
    order: OrderData
    tutorial?: boolean
    tutorialLevel?: number
    completedPlayers: number //Number of players who have completed the order
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

  type Asset = {
    _type: string
    _ref: string
  }

  type MaterialMetadata = {
    materialId: MaterialId
    tokenAddress: string
    name: string
    difficulty: MATERIAL_DIFFICULTY
    // Optionally extended by the schema from Sanity
    image?: Asset
    title?: string
    _updatedAt?: string
    _type?: string
    _createdAt?: string
    _rev?: string
    _id?: string
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
