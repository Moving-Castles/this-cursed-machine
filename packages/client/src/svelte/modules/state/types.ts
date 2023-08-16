import {
  EntityType,
  ConnectionType,
  PortType,
  MachineType,
  ResourceType,
  PortPlacement,
  Rotation
} from './enums'

declare global {
  // Default type with all potential properties.
  type Entity = {
    [key: string]: any;
    gameConfig?: GameConfig;
    type?: EntityType;
    machineType?: MachineType;
    resourceType?: ResourceType;
    connectionType?: ConnectionType;
    portType?: PortType;
    // ...
    creationBlock?: number;
    name?: string;
    readyBlock?: number;
    level?: number;
    height?: number;
    width?: number;
    active?: boolean;
    minCores?: number;
    maxCores?: number;
    isPrototype?: boolean;
    carriedBy?: string;
    position?: Coord;
    sourcePort?: string;
    targetPort?: string;
    claimBlock?: number;
    portPlacement?: PortPlacement;
    rotation?: Rotation;
  };

  type BuildableEntity = {
    type: EntityType.MACHINE;
    name: string;
    cost: number;
  }

  type Box = {
    type: EntityType.BOX;
    creationBlock: number;
    level: number;
    width: number;
    height: number;
    minCores: number;
    maxCores: number;
    active: boolean;
  }

  type Core = {
    type: EntityType.CORE;
    name: string;
    creationBlock: number;
    readyBlock: number;
    level: number;
    carriedBy: string;
    position: Coord;
    rotation: Rotation;
  };

  type Claim = {
    type: EntityType.CLAIM;
    creationBlock: number;
    claimBlock: number;
  }

  type Connection = {
    type: EntityType.CONNECTION;
    creationBlock: number;
    sourcePort: string;
    targetPort: string;
  }

  type Port = {
    type: EntityType.PORT;
    creationBlock: number;
    portType: PortType;
    portPlacement: PortPlacement;
    carriedBy: string;
  }

  type Resource = {
    type: EntityType.RESOURCE;
    creationBlock: number;
    position: Coord;
  };

  type ResourceToEnergy = {
    type: EntityType.MACHINE;
    creationBlock: number;
    position: Coord;
    energy?: number;
  };

  type GameConfig = {
    coolDown: number;
    coreEnergyCap: number;
    coreInitialEnergy: number;
    resourceConnectionCost: number;
    controlConnectionCost: number;
    buildCost: number;
  }

  // ---

  type Organ = Resource | ResourceToEnergy

  // ---

  type Entities = {
    [index: string]: Entity;
  };

  type Cores = {
    [index: string]: Core;
  };

  type Connections = {
    [index: string]: Connection;
  };

  type Ports = {
    [index: string]: Port;
  };

  type Claims = {
    [index: string]: Claim;
  };

  type Organs = {
    [index: string]: Organ;
  };

  type Resources = {
    [index: string]: Resource;
  };

  type Boxes = {
    [index: string]: Box;
  };

  // ---

  type Coord = {
    x: number;
    y: number;
  };

  type CalculatedEnergies = {
    [index: string]: number;
  };

  interface GridTile {
    id: string
    coordinates: Coord;
  }

  type EntityStoreEntry = {
    address: string
    entity: Entity
  }
}