enum BuildableEntityType {
  RESOURCE,
  RESOURCE_TO_ENERGY
}

enum EntityType {
  BOX, 
  CORE, 
  MACHINE, 
  CONNECTION, 
  RESOURCE, 
  PORT, 
  CLAIM
}

enum MachineType {
  BLOCKER,
  SPLITTER,
  COMBINATOR,
  MIXER,
  FILTER,
  SHOWER,
  DRYER,
  HEATER,
  FREEZER,
  GRINDER
}

enum ResourceType {
  PELLET, 
  DIRT, 
  PISS, 
  BLOOD
}

enum PortType {
  INPUT,
  OUTPUT
}

enum ConnectionType {
  RESOURCE,
  CONTROL
}

declare global {
  
  // Default type with all potential properties.
  type Entity = {
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
    sourceEntity?: string;
    targetEntity?: string;
    claimBlock?: number;
    gameConfig?: GameConfig;
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
  };

  type Claim = {
    type: EntityType.CLAIM;
    creationBlock: number;
    sourceEntity: string;
    targetEntity: string;
    claimBlock: number;
  }

  type Connection = {
    type: EntityType.CONNECTION;
    creationBlock: number;
    sourceEntity: string;
    targetEntity: string;
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
    gameConfig: {
      coolDown: number;
      coreEnergyCap: number;
      coreInitialEnergy: number;
      resourceConnectionCost: number;
      controlConnectionCost: number;
      buildCost: number;
    }
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

  type Claims = {
    [index: string]: Claim;
  };
  
  type Organs = {
    [index: string]: Organ;
  };
  
  type Resources = {
    [index: string]: Resource;
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

// Only explicitly export enums
export {
  EntityType,
  ConnectionType,
  PortType,
  MachineType,
  ResourceType,
  BuildableEntityType
}