import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";
/**
 * Importing this enables "snap sync mode".
 * It allows clients to sync the latest state of the world using view functions.
 * This is a simple way to quickly sync without the use of an external indexer.
 * This could lead to expensive queries on live RPCs if the world is large,
 * so we suggest using MODE for production deployments.
 */
// import "@latticexyz/world/snapsync";

export default mudConfig({
    snapSync: false,
    deploysDirectory: "./deploys",
    namespace: "mc",
    enums: {
        EntityType: ["CORE", "UNTRAVERSABLE", "RESOURCE_CONNECTION", "CONTROL_CONNECTION", "RESOURCE", "RESOURCE_TO_ENERGY"]
    },
    tables: {
        Type: "EntityType",
        Name: "string",
        Energy: "uint32",
        ReadyBlock: "uint256",
        BodyId: "uint32",
        Level: "uint32",
        Position: {
            schema: {
                x: "int32",
                y: "int32",
            },
        },
        ConnectionCapacity: "uint32",
        SourceEntity: "bytes32",
        TargetEntity: "bytes32",
        StartBlock: "uint256",
        GameConfig: {
            keySchema: {},
            schema: {
                worldHeight: "int32",
                worldWidth: "int32",
                coolDown: "uint32",
                coreEnergyCap: "uint32",
                coreInitialEnergy: "uint32",
                resourceConnectionCost: "uint32",
                controlConnectionCost: "uint32",
                buildCost: "uint32",
            },
            dataStruct: true,
        },
    },
    modules: [
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("Position")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("Type")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("BodyId")],
        },
        {
            name: "KeysInTableModule",
            root: true,
            args: [resolveTableId("StartBlock")],
        }
    ],
});
