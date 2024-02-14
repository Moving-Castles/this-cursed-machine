enum ENTITY_TYPE {
    NONE,
    ORDER,
    POD,
    MACHINE,
    DEPOT
}

enum MACHINE_TYPE {
    NONE,
    INLET,
    OUTLET,
    PLAYER,
    SPLITTER,
    MIXER,
    DRYER,
    WETTER,
    BOILER,
    COOLER
}

enum MATERIAL_TYPE {
    NONE,
    BUG,
    PISS,
    BLOOD,
    BLOOD_MEAL,
    COAGULATED_BLOOD_CUBES,
    NESTLE_PURE_LIFE_BOTTLED_WATER,
    AMMONIA,
    AESOP_ORGANIC_HAND_SOAP,
    PURE_FAT,
    CSX_INDUSTRIAL_GREASE
}

enum PORT_INDEX {
    FIRST,
    SECOND
}

function getEnumNames(enumObj: any): string[] {
    // Filter the keys to remove the numeric ones, leaving only the string keys
    return Object.keys(enumObj).filter(key => isNaN(Number(key)));
}

const ENTITY_TYPE_ARRAY = getEnumNames(ENTITY_TYPE);
const MACHINE_TYPE_ARRAY = getEnumNames(MACHINE_TYPE);
const MATERIAL_TYPE_ARRAY = getEnumNames(MATERIAL_TYPE);
const PORT_INDEX_ARRAY = getEnumNames(PORT_INDEX);

export {
    ENTITY_TYPE,
    MACHINE_TYPE,
    MATERIAL_TYPE,
    PORT_INDEX,
    ENTITY_TYPE_ARRAY,
    MACHINE_TYPE_ARRAY,
    MATERIAL_TYPE_ARRAY,
    PORT_INDEX_ARRAY
}
