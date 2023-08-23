export enum EntityType {
    BOX,
    MACHINE,
    CONNECTION,
    MATERIAL,
    PORT
}
export enum MachineType {
    BLOCKER,
    INLET,
    OUTLET,
    CORE,
    BLENDER,
    SPLITTER,
    SCORCHER
}

export enum MaterialType {
    PELLET,
    BLOOD,
    PISS,
    DIRT,
    SAND,
    FLESH
}

export enum PortType {
    INPUT,
    OUTPUT
}

export enum ConnectionType {
    CONTROL,
    RESOURCE
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