enum EntityType {
  CORE,
  RESOURCE,
  PORTAL,
  MOVER,
  CONTROL_SPLIT,
  CONVERTER
}

enum ConnectionType {
  RESOURCE,
  CONTROL,
}

declare global {
  
  // Default type with all potential properties.
  type Entity = {
    type?: EntityType;
    name?: string;
    readyBlock?: number;
    startBlock?: number;
    resourceConnection?: string;
    controlConnection?: string;
    energy?: number;
    position?: Coord;
    realmId?: number;
    gameConfig?: GameConfig;
  };
  
  type Core = {
    type: EntityType.CORE;
    name: string;
    readyBlock: number;
    startBlock?: number;
    position: Coord;
    realmId: number;
    energy: number;
    resourceConnection?: string;
    controlConnection?: string;
  };
  
  type Mover = {
    type: EntityType.MOVER;
    name: string;
    energy: number;
    position: Coord;
  };
  
  type Resource = {
    type: EntityType.RESOURCE;
    name: string;
    position: Coord;
  };
  
  type Portal = {
    type: EntityType.PORTAL;
    name: string;
    energy: number;
    position: Coord;
  };
  
  type ControlSplit = {
    type: EntityType.CONTROL_SPLIT;
    name: string;
    controlConnection?: string;
    position: Coord;
  };
  
  type Converter = {
    type: EntityType.CONVERTER;
    name: string;
    position: Coord;
    resourceConnection?: string;
    controlConnection?: string;
  };
  
  type GameConfig = {
    gameConfig: {
      worldHeight: number;
      worldWidth: number;
      coolDown: number;
      coreEnergyCap: number;
      coreCrystallizedSludgeCap: number;
      coreInitialEnergy: number;
      resourceConnectionCost: number;
      controlConnectionCost: number;
      converterCost: number;
      controlSplitCost: number;
    }
  }

  // ---
  
  type Organ = Mover | Resource | Portal | ControlSplit | Converter

  // ---
  
  type Entities = {
    [index: string]: Entity;
  };
  
  type Cores = {
    [index: string]: Core;
  };
  
  type Organs = {
    [index: string]: Organ;
  };

  type Movers = {
    [index: string]: Mover;
  };
  
  type Resources = {
    [index: string]: Resource;
  };
  
  type Portals = {
    [index: string]: Portal;
  };
  
  type ControlSplits = {
    [index: string]: ControlSplit;
  };
  
  type Converters = {
    [index: string]: Converter;
  };
  
  // ---
  
  type Coord = {
    x: number;
    y: number;
  };
  
  type Connection = {
    type: ConnectionType;
    start: Coord,
    end: Coord
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
  ConnectionType
}