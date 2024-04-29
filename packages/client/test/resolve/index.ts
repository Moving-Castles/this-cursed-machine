import { stringToHex } from "viem";
import { getMaterialCombinationId } from "../../src/svelte/modules/utils";

export const MaterialIds = {
    NONE: "0x",
    BUG: stringToHex("t_BUGS", { size: 14 }),
    PISS: stringToHex("t_PISS", { size: 14 }),
    BLOOD: stringToHex("t_BLOOD", { size: 14 }),
    UREA: stringToHex("t_UREA", { size: 14 }),
    INDUSTRIAL_LUBRICANT: stringToHex("t_LUBE", { size: 14 }),
    FAT: stringToHex("t_FAT", { size: 14 }),
    AMMONIA: stringToHex("t_AMMONIA", { size: 14 }),
    SOAP: stringToHex("t_SOAP", { size: 14 }),
}

export const RECIPES = [
    {
        machineType: 3,
        input: MaterialIds.BUG,
        outputs: [
            MaterialIds.PISS,
            MaterialIds.BLOOD
        ]
    },
    {
        machineType: 5,
        input: getMaterialCombinationId(MaterialIds.BLOOD, MaterialIds.PISS),
        outputs: [
            MaterialIds.AMMONIA,
            MaterialIds.NONE
        ]
    }
]
