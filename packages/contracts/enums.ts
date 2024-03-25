enum ENTITY_TYPE {
    NONE,
    ORDER,
    OFFER,
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
    BOILER,
    CENTRIFUGE,
    GRINDER,
    RAT_CAGE,
    MEALWORM_VAT
}

enum MATERIAL_TYPE {
    NONE,
    BUG,
    PISS,
    BLOOD,
    BLOOD_MEAL,
    BLOOD_CLOT,
    BLOOD_SAUSAGE,
    HEMATURIC_FLUID,
    UREA,
    AMMONIA,
    FERTILIZER,
    AESOP_SOAP,
    CONGEALED_FAT,
    RENDERED_FAT,
    ANTIFREEZE,
    INDUSTRIAL_LUBRICANT,
    EVIAN,
    LOW_GRADE_AMPHETAMINE,
    MEDICAL_WASTE,
    INSULIN,
    DUST,
    ORGANIC_WASTE,
    CONTAMINATED_WATER,
    END
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
