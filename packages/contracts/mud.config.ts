import { mudConfig, resolveTableId } from "@latticexyz/world/register";
import { ENTITY_TYPE_ARRAY, MACHINE_TYPE_ARRAY, MATERIAL_TYPE_ARRAY, PORT_INDEX_ARRAY } from "./enums";

export const enums = {
    ENTITY_TYPE: ENTITY_TYPE_ARRAY,
    MACHINE_TYPE: MACHINE_TYPE_ARRAY,
    MATERIAL_TYPE: MATERIAL_TYPE_ARRAY,
    PORT_INDEX: PORT_INDEX_ARRAY
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
                scaleDown: "uint32", // Used to scale down the amounts in the UI
                flowRate: "uint32", // Amount flowing from the inlet
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
        DepotConnection: "bytes32",
        MachinesInPod: "bytes32[]",
        DepotsInPod: "bytes32[]",
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
