import { defineWorld } from "@latticexyz/world";
import { ENTITY_TYPE_ARRAY, MACHINE_TYPE_ARRAY, PORT_INDEX_ARRAY } from "./enums";

const enums = {
    ENTITY_TYPE: ENTITY_TYPE_ARRAY,
    MACHINE_TYPE: MACHINE_TYPE_ARRAY,
    PORT_INDEX: PORT_INDEX_ARRAY
}

const MATERIAL_ID_TYPE = "bytes14" as const
const userTypes = {
    MaterialId: { filePath: "./src/libraries/LibMaterial.sol", type: MATERIAL_ID_TYPE },
} as const

export default defineWorld({
    enums,
    userTypes,
    tables: {
        GameConfig: {
            key: [],
            schema: {
                adminAddress: "address",
                globalSpawnIndex: "uint32", // How many players have spawned since the beginning of the world?
                flowRate: "uint256", // Amount flowing from the inlet
                tankCapacity: "uint256", // Amount of material that can be stored in a tank
            },
            codegen: {
                dataStruct: true
            }
        },
        MaterialMetadata: {
            key: ["materialId"],
            schema: {
                materialId: "MaterialId",
                tokenAddress: "address",
                name: "string",
            }
        },
        EntityType: "ENTITY_TYPE",
        MachineType: "MACHINE_TYPE",
        ContainedMaterial: "MaterialId", // Type of material in tank
        Amount: "uint256", // Amount of material in tank
        Name: "string", // Player name. Assigned after completed tutorial.
        CarriedBy: "bytes32", // ID of the pod that the entity is in, used for access control
        BuildIndex: "uint32", // Build index of a particular machine type in a particular pod
        BuildTracker: "uint32[]", // How many machines of each type have been built in pod since its creation?
        SpawnIndex: "uint32", // How many players have spawned?
        Tutorial: "bool",
        TutorialLevel: "uint32",
        NonTransferableBalance: "uint256", // During tutorial we give players a non-transferable token substitute
        Order: {
            key: ["key"],
            schema: {
                key: "bytes32",
                creationBlock: "uint256",
                creator: "address",
                materialId: "MaterialId",
                amount: "uint256",
                expirationBlock: "uint256",
                reward: "uint256",
                maxPlayers: "uint32",
                title: "string"
            }
        },
        Offer: {
            key: ["key"],
            schema: {
                key: "bytes32",
                materialId: "MaterialId", // Type of material offered
                amount: "uint256", // Amount of material offered
                cost: "uint256", // Cost of material in $BUGS
            }
        },
        Completed: "bytes32[]", // On player: list of completed order, On order: list of players who completed
        ProducedMaterials: `${MATERIAL_ID_TYPE}[]`, // List of materials produced by player
        LastResolved: "uint256", // Used to keep track block past since last resolution of pod
        IncomingConnections: "bytes32[]", // Incoming connections on a machine
        OutgoingConnections: "bytes32[]", // Outgoing connections on a machine
        TankConnection: "bytes32", // Set on tanks and inlets/outlet to connect them
        MachinesInPod: "bytes32[]", // IDs of machines in pod
        TanksInPod: "bytes32[]", // IDs of tanks in pod
        FixedEntities: {
            key: ["key"],
            schema: {
                key: "bytes32",
                outlet: "bytes32",
                inlets: "bytes32[]"
            }
        },
        CurrentOrder: "bytes32", // ID of the order the player has accepted
        Recipe: {
            key: ["machineType", "input"],
            schema: {
                machineType: "MACHINE_TYPE",
                input: "bytes32", // Material combination id
                outputs: `${MATERIAL_ID_TYPE}[2]`
            }
        }
    },
    modules: [
        {
            name: "UniqueEntityModule",
            root: true,
            args: [],
        }
    ],
});
