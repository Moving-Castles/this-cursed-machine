enum ENTITY_TYPE {
    NONE,
    ORDER,
    OFFER,
    POD,
    MACHINE,
    TANK
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
    FRUIT_ROLL_UP,
    BLOOD_MEAL,
    BACTERIA_MAT,
    BACTERIA,
    SOUP,
    BLOOD_SAUSAGE,
    BUG_FLOUR,
    PANINI,
    SAUSAGE_PANINI,
    COOKING_MARGARINE,
    LOW_GRADE_AMPHETAMINE,
    INSULIN,
    ADRENOCHROME,
    HEMATURIC_FLUID,
    CONGEALED_FAT,
    AMMONIA,
    SKIN_CREAM,
    AESOP_SOAP,
    PURIFIED_LUBRICANT,
    GROWTH_HORMONE,
    PARASITE,
    SUPERBUG,
    YEAST,
    DUST,
    UREA,
    FERTILIZER,
    EVIAN,
    BLOOD_CLOT,
    ORGANIC_WASTE,
    INDUSTRIAL_LUBRICANT,
    ANTIFREEZE,
    MEDICAL_WASTE,
    GLUE,
    PLASMA,
    PLASMA_POWDER,
    LIPOPROTEIN,
    MUCUS,
    STOMACH_LINING,
    SLUDGE,
    SALT,
    MSG,
    CONTAMINATED_WATER,
    LATEX,
    SWEAT,
    PARASITE_JERKY,
    GROWN_PARASITE,
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
