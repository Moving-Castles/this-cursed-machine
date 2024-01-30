import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export const enums = {
    ENTITY_TYPE: ["NONE", "BUILD_INDEX", "RECIPE", "ORDER", "POD", "MACHINE", "STORAGE", "DISPENSER"],
    MACHINE_TYPE: ["NONE", "INLET", "OUTLET", "PLAYER", "SPLITTER", "MIXER", "DRYER", "WETTER", "BOILER", "COOLER"],
    MATERIAL_TYPE: ["NONE", "BUG", "PISS", "BLOOD", "SLUDGE", "DIRT", "BLOOD_LIPIDS", "PLANT", "CAFFEINE_SLUSHY", "CLUB_MATE", "DIET_RED_BULL", "PRIME", "M150", "FIVE_HOUR_ENERGY", "MONSTER", "E_LIQUID", "TOBACCO", "CIGARETTE_JUICE", "ERASERBABY"],
    PORT_INDEX: ["FIRST", "SECOND"]
}

export default mudConfig({
    deploysDirectory: "./deploys",
    enums,
    tables: {
        GameConfig: {
            keySchema: {},
            valueSchema: {
                tokenAddress: "address",
                globalSpawnIndex: "uint32",
            },
            dataStruct: true,
        },
        // ...
        EntityType: "ENTITY_TYPE",
        MachineType: "MACHINE_TYPE",
        MaterialType: "MATERIAL_TYPE",
        Amount: "uint32",
        // ...
        Name: "string", // Player name. Assigned after completed tutorial.
        CarriedBy: "bytes32", // ID of the pod that the entity is in
        CreationBlock: "uint256",
        BuildIndex: "uint32",
        SpawnIndex: "uint32",
        // ...
        Tutorial: "bool",
        TutorialLevel: "uint32",
        TutorialOrders: {
            keySchema: {},
            valueSchema: {
                value: "bytes32[2]"
            }
        },
        CompletedPlayers: "bytes32[]",
        // ...
        LastResolved: "uint256",
        Input: "uint256",
        Output: "MATERIAL_TYPE",
        // ...
        OutgoingConnections: "bytes32[]",
        IncomingConnections: "bytes32[]",
        // ...
        StorageConnection: "bytes32",
        MachinesInPod: "bytes32[]",
        StorageInPod: "bytes32[]",
        OutletEntity: "bytes32",
        InletEntity: "bytes32",
        DispenserEntity: "bytes32",
        CurrentOrder: "bytes32",
        GoalEntity: "bytes32",
        ResourceEntity: "bytes32"
    },
    modules: [
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("MaterialType")],
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
