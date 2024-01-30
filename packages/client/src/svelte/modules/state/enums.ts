export enum EntityType {
  NONE,
  BUILD_INDEX,
  RECIPE,
  ORDER,
  POD,
  MACHINE,
  STORAGE,
  DISPENSER
}

export enum MachineType {
  NONE,
  INLET,
  OUTLET,
  PLAYER,
  SPLITTER,
  MIXER,
  DRYER,
  WETTER,
  BOILER,
  COOLER,
}

export enum MaterialType {
  NONE,
  BUG,
  PISS,
  BLOOD,
  SLUDGE,
  DIRT,
  BLOOD_LIPIDS,
  PLANT,
  CAFFEINE_SLUSHY,
  CLUB_MATE,
  DIET_RED_BULL,
  PRIME,
  M150,
  FIVE_HOUR_ENERGY,
  MONSTER,
  E_LIQUID,
  TOBACCO,
  CIGARETTE_JUICE,
  ERASERBABY,
}

export enum PortIndex {
  FIRST,
  SECOND
}

export enum ConnectionState {
  NONE,
  CONNECTED,
  FLOWING,
}
