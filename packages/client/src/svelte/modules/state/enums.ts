export enum EntityType {
  NONE,
  BOX,
  MACHINE,
  CONNECTION,
  MATERIAL,
  PORT,
}
export enum MachineType {
  BLOCKER,
  INLET,
  OUTLET,
  CORE,
  BLENDER,
  SPLITTER,
  SCORCHER,
  COMBI_GATE,
}

export enum MaterialType {
  NONE,
  PELLET,
  BLOOD,
  PISS,
  DIRT,
  SAND,
  FLESH,
  TEETH,
}

export enum PortType {
  INPUT,
  OUTPUT,
}

export enum ConnectionType {
  CONTROL,
  RESOURCE,
}

export enum PortPlacement {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}
