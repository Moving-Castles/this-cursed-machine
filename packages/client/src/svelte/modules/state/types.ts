import {
  EntityType,
  MaterialType,
  PortType,
  MachineType,
  PortPlacement,
} from "./enums"

export {
  EntityType,
  MaterialType,
  PortType,
  MachineType,
  PortPlacement
} from "./enums"

declare global {
  // Default type with all potential properties.
  type Entity = {
    [key: string]: any
    gameConfig?: GameConfig
    type?: EntityType
    machineType?: MachineType
    materialType?: MaterialType
    portType?: PortType
    // ...
    creationBlock?: number
    name?: string
    energy?: number
    readyBlock?: number
    level?: number
    carriedBy?: string
    sourcePort?: string
    targetPort?: string
    portPlacement?: PortPlacement
    amount?: number
    lastResolved?: number
    temperature?: number
    potential?: boolean
  }

  type BuildableEntity = {
    type: EntityType.MACHINE
    name: string
    cost: number
  }

  type BuildableMachine = {
    type: MachineType
    name: string
    cost: number
  }

  type Box = {
    type: EntityType.BOX
    creationBlock: number
    level: number
    lastResolved: number
  }

  type Level = {
    type: EntityType.LEVEL
    level: number
    creationBlock: number
  }

  type Core = {
    type: EntityType.MACHINE
    machineType: MachineType.CORE
    name: string
    creationBlock: number
    energy: number
    readyBlock: number
    level: number
    carriedBy: string
  }

  type Connection = {
    type: EntityType.CONNECTION
    creationBlock: number
    sourcePort: string
    targetPort: string
  }

  type Machine = {
    type: EntityType.MACHINE
    machineType: MachineType
    creationBlock: number
    carriedBy: string
    name?: string
    energy?: number
    readyBlock?: number
    level?: number
  }

  type Port = {
    type: EntityType.PORT
    creationBlock: number
    portType: PortType
    portPlacement: PortPlacement
    carriedBy: string
  }

  type Material = {
    type: EntityType.MATERIAL
    creationBlock: number
    amount: number
    temperature: number
  }

  type ResourceToEnergy = {
    type: EntityType.MACHINE
    creationBlock: number
    energy?: number
  }

  type GameConfig = {
    coolDown: number
    coreEnergyCap: number
    coreInitialEnergy: number
    resourceConnectionCost: number
    controlConnectionCost: number
    buildCost: number
  }

  // ---

  type Entities = {
    [index: string]: Entity
  }

  type Cores = {
    [index: string]: Core
  }

  type Connections = {
    [index: string]: Connection
  }

  type Ports = {
    [index: string]: Port
  }

  type Machines = {
    [index: string]: Machine
  }

  type Boxes = {
    [index: string]: Box
  }

  type Levels = {
    [index: string]: Level
  }

  // ---

  type Coord = {
    x: number
    y: number
  }

  type CalculatedEnergies = {
    [index: string]: number
  }

  type PathDefinition = {
    coords: Coord[]
    startEntity?: Entity
    endEntity?: Entity
    sourcePort?: Port
    targetPort?: Port
    potential?: Boolean
  }

  interface GridTile {
    id: string
    coordinates: Coord
  }

  type EntityStoreEntry = {
    address: string
    entity: Entity
  }
}
