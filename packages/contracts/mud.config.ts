import { defineWorld } from "@latticexyz/world";
import { ENTITY_TYPE_ARRAY, MACHINE_TYPE_ARRAY, MATERIAL_TYPE_ARRAY, PORT_INDEX_ARRAY } from "./enums";

const enums = {
    ENTITY_TYPE: ENTITY_TYPE_ARRAY,
    MACHINE_TYPE: MACHINE_TYPE_ARRAY,
    MATERIAL_TYPE: MATERIAL_TYPE_ARRAY,
    PORT_INDEX: PORT_INDEX_ARRAY
}

export default defineWorld({
    enums,
    // excludeSystems: ["DevSystem"],
    tables: {
        GameConfig: {
            key: [],
            schema: {
                adminAddress: "address",
                tokenAddress: "address",
                globalSpawnIndex: "uint32", // Global index for all players
                scaleDown: "uint32", // Used to scale down the amounts in the UI
                flowRate: "uint32", // Amount flowing from the inlet
                tankCapacity: "uint32", // Amount of material that can be stored in a tank
            },
            codegen: {
                dataStruct: true
            }
        },
        EntityType: "ENTITY_TYPE",
        MachineType: "MACHINE_TYPE",
        MaterialType: "MATERIAL_TYPE",
        Amount: "uint32",
        Name: "string", // Player name. Assigned after completed tutorial.
        CarriedBy: "bytes32", // ID of the pod that the entity is in, used for access control
        BuildIndex: "uint32", // Build index of a particular machine type in a particular pod
        BuildTracker: "uint32[]", // How many machines of each type have been built in pod since its creation?
        SpawnIndex: "uint32", // How many players have spawned?
        Tutorial: "bool",
        TutorialLevel: "uint32",
        NonTransferableBalance: "uint32", // During tutorial we give players a non-transferable token substitute
        Order: {
            key: ["key"],
            schema: {
                key: "bytes32",
                creationBlock: "uint256",
                creator: "bytes32",
                materialType: "MATERIAL_TYPE",
                amount: "uint32",
                expirationBlock: "uint256",
                reward: "uint32",
                maxPlayers: "uint32",
                title: "string"
            }
        },
        Offer: {
            key: ["key"],
            schema: {
                key: "bytes32",
                materialType: "MATERIAL_TYPE",
                amount: "uint32",
                cost: "uint32",
            }
        },
        Completed: "bytes32[]", // On player: list of completed order, On order: list of players who completed
        LastResolved: "uint256", // Used to keep track block past since last resolution of pod
        IncomingConnections: "bytes32[]",
        OutgoingConnections: "bytes32[]",
        TankConnection: "bytes32",
        MachinesInPod: "bytes32[]",
        TanksInPod: "bytes32[]",
        FixedEntities: {
            key: ["key"],
            schema: {
                key: "bytes32",
                outlet: "bytes32",
                inlets: "bytes32[]"
            }
        },
        CurrentOrder: "bytes32",
        Recipe: {
            key: ["machineType", "input"],
            schema: {
                machineType: "MACHINE_TYPE",
                input: "uint256",
                outputs: "uint8[2]"
            }
        }
    },
    modules: [
        {
            name: "UniqueEntityModule",
            root: true,
            args: [],
        },
        // {
        //     name: "StandardDelegationsModule",
        //     root: true,
        //     args: [],
        // },
        // {
        //     name: "PuppetModule",
        //     root: false,
        //     args: []
        // }
    ],
});
