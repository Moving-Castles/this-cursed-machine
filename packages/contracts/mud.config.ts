import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export const enums = {
    ENTITY_TYPE: ["NONE", "BUILD_INDEX", "RECIPE", "LEVEL", "GOAL", "BOX", "MACHINE", "MATERIAL"],
    MACHINE_TYPE: ["NONE", "INLET", "OUTLET", "CORE", "SPLITTER", "MIXER", "DRYER", "WETTER", "BOILER", "COOLER"],
    MATERIAL_TYPE: ["NONE", "BUG", "PISS", "BLOOD", "SLUDGE", "DIRT", "BLOOD_LIPIDS", "PLANT", "CAFFEINE_SLUSHY", "CLUB_MATE", "DIET_RED_BULL", "PRIME", "M150", "FIVE_HOUR_ENERGY", "MONSTER", "E_LIQUID", "TOBACCO", "CIGARETTE_JUICE", "ERASERBABY"],
    PORT_INDEX: ["FIRST", "SECOND"]
}

export default mudConfig({
    deploysDirectory: "./deploys",
    enums,
    tables: {
        EntityType: "ENTITY_TYPE",
        MachineType: "MACHINE_TYPE",
        MaterialType: "MATERIAL_TYPE",
        Name: "string",
        Energy: "uint32",
        CarriedBy: "bytes32",
        CreatedBy: "bytes32",
        Amount: "uint32",
        CreationBlock: "uint256",
        BuildIndex: "uint32",
        Level: "uint32",
        LastResolved: "uint256",
        Input: "uint256",
        Output: "MATERIAL_TYPE",
        OutgoingConnections: "bytes32[]",
        IncomingConnections: "bytes32[]",
        MachinesInPod: "bytes32[]",
        MaterialsInPod: "bytes32[]",
        CompletionTimes: "uint256[]",
        LevelStartBlock: "uint256",
        GameConfig: {
            keySchema: {},
            valueSchema: {
                coolDown: "uint32",
                connectionCost: "uint32",
                buildCost: "uint32",
            },
            dataStruct: true,
        },
    },
    modules: [
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("EntityType")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("MachineType")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("MaterialType")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("Level")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("CarriedBy")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("Input")],
        },
    ],
});
