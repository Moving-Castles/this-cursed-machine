enum ENTITY_TYPE {
  NONE,
  ORDER,
  OFFER,
  POD,
  MACHINE,
  TANK,
}

enum MACHINE_TYPE {
  NONE,
  INLET,
  OUTLET,
  PLAYER,
  SPLITTER,
  MIXER,
  DRYER,
  BOILER,
  CENTRIFUGE,
  GRINDER,
  RAT_CAGE,
  MEALWORM_VAT,
}

enum PORT_INDEX {
  FIRST,
  SECOND,
}

enum MATERIAL_DIFFICULTY {
  NOVICE,
  INTERMEDIATE,
  ADVANCED,
  NIGHTMARE,
}

function getEnumNames(enumObj: any): string[] {
  // Filter the keys to remove the numeric ones, leaving only the string keys
  return Object.keys(enumObj).filter((key) => isNaN(Number(key)));
}

const ENTITY_TYPE_ARRAY = getEnumNames(ENTITY_TYPE);
const MACHINE_TYPE_ARRAY = getEnumNames(MACHINE_TYPE);
const PORT_INDEX_ARRAY = getEnumNames(PORT_INDEX);
const MATERIAL_DIFFICULTY_ARRAY = getEnumNames(MATERIAL_DIFFICULTY);

export {
  ENTITY_TYPE,
  MACHINE_TYPE,
  PORT_INDEX,
  MATERIAL_DIFFICULTY,
  ENTITY_TYPE_ARRAY,
  MACHINE_TYPE_ARRAY,
  PORT_INDEX_ARRAY,
  MATERIAL_DIFFICULTY_ARRAY,
};
