enum BuildableEntityType {
  RESOURCE,
  RESOURCE_TO_ENERGY
}

enum EntityType {
  CORE,
  UNTRAVERSABLE,
  RESOURCE_CONNECTION,
  CONTROL_CONNECTION,
  CLAIM,
  RESOURCE,
  RESOURCE_TO_ENERGY
}

enum ConnectionType {
  RESOURCE,
  CONTROL
}

declare global {
  
  // Default type with all potential properties.
  type Entity = {
    type?: EntityType;
    creationBlock?: number;
    name?: string;
    energy?: number;
    readyBlock?: number;
    bodyId?: number;
    level?: number;
    position?: Coord;
    connectionCapacity?: number;
    sourceEntity?: string;
    targetEntity?: string;
    startBlock?: number;
    gameConfig?: GameConfig;
  };

  type BuildableEntity = {
    type: EntityType.RESOURCE | EntityType.RESOURCE_TO_ENERGY;
    name: string;
    cost: number;
  }
  
  type Core = {
    type: EntityType.CORE;
    creationBlock: number;
    name: string;
    energy: number;
    readyBlock: number;
    bodyId: number;
    level?: number;
    position: Coord;
  };

  type Claim = {
    type: EntityType.CLAIM;
    creationBlock: number;
    sourceEntity: string;
    targetEntity: string;
    startBlock: number;
  }

  type Connection = {
    type: EntityType.RESOURCE_CONNECTION | EntityType.CONTROL_CONNECTION;
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
    type: EntityType.RESOURCE_TO_ENERGY;
    creationBlock: number;
    position: Coord;
  };
  
  type GameConfig = {
    gameConfig: {
      worldHeight: number;
      worldWidth: number;
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
  BuildableEntityType
}