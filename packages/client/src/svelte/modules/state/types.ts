import { EntityType, MaterialType, PortType, MachineType } from "./enums"

export { EntityType, MaterialType, PortType, MachineType } from "./enums"

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
    input?: number
    output?: MaterialType
    amount?: number
    lastResolved?: number
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
    portType: PortType
    carriedBy: string
  }

  type Material = {
    type: EntityType.MATERIAL
    amount: number
  }

  type GameConfig = {
    coolDown: number
    connectionCost: number
    buildCost: number
  }

  type Recipe = {
    type: EntityType.RECIPE
    machineType: MachineType
    input: number
    output: MaterialType
  }

  type Goal = {
    type: EntityType.GOAL
    level: number
    materialType: MaterialType
    amount: number
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

  type Recipes = {
    [index: string]: Recipe
  }

  type Goals = {
    [index: string]: Goal
  }

  type Materials = {
    [index: string]: Material
  }

  // ---

  type Coord = {
    x: number
    y: number
  }

  type CalculatedEnergies = {
    [index: string]: number
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
