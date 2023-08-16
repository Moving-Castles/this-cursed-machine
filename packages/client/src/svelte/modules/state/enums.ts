export enum BuildableEntityType {
    RESOURCE,
    RESOURCE_TO_ENERGY
}

export enum EntityType {
    BOX,
    CORE,
    MACHINE,
    CONNECTION,
    RESOURCE,
    PORT,
    CLAIM
}

export enum MachineType {
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

export enum ResourceType {
    PELLET,
    DIRT,
    PISS,
    BLOOD
}

export enum PortType {
    INPUT,
    OUTPUT
}

export enum ConnectionType {
    RESOURCE,
    CONTROL
}

export enum PortPlacement {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

export enum Rotation {
    DEG0,
    DEG90,
    DEG180,
    DEG270
}