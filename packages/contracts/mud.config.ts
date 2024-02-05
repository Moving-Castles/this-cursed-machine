import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export const enums = {
    ENTITY_TYPE: ["NONE", "BUILD_INDEX", "ORDER", "POD", "MACHINE", "STORAGE"],
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
                globalSpawnIndex: "uint32", // Global index for all players
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
        BuildIndex: "uint32", // Index of the machines in the pod, used by machine type
        SpawnIndex: "uint32",
        // ...
        Tutorial: "bool",
        TutorialLevel: "uint32",
        TutorialOrders: {
            keySchema: {},
            valueSchema: {
                value: "bytes32[]"
            }
        },
        Order: {
            valueSchema: {
                creationBlock: "uint256",
                resourceMaterialType: "MATERIAL_TYPE",
                resourceAmount: "uint32",
                goalMaterialType: "MATERIAL_TYPE",
                goalAmount: "uint32",
                rewardAmount: "uint32",
                maxPlayers: "uint32",
                duration: "uint256"
            }
        },
        CompletedPlayers: "bytes32[]",
        // ...
        LastResolved: "uint256",
        Input: "uint256",
        Output: "MATERIAL_TYPE",
        // ...
        IncomingConnections: "bytes32[]",
        OutgoingConnections: "bytes32[]",
        StorageConnection: "bytes32",
        MachinesInPod: "bytes32[]",
        StorageInPod: "bytes32[]",
        FixedEntities: {
            valueSchema: {
                outlet: "bytes32",
                inlets: "bytes32[]"
            }
        },
        CurrentOrder: "bytes32",
        Recipe: {
            keySchema: {
                machineType: "MACHINE_TYPE",
                input: "uint256",
            },
            valueSchema: "MATERIAL_TYPE"
        }
    },
    modules: [
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("CarriedBy")],
        },
        {
            name: "UniqueEntityModule",
            root: true,
            args: [],
        },
    ],
});
