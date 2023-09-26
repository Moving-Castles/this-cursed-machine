import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export const enums = {
    ENTITY_TYPE: ["BOX", "MACHINE", "CONNECTION", "MATERIAL", "PORT"],
    MACHINE_TYPE: ["BLOCKER", "INLET", "OUTLET", "CORE", "BLENDER", "SPLITTER", "SCORCHER", "COMBI_GATE"],
    MATERIAL_TYPE: ["NONE", "PELLET", "BLOOD", "PISS", "DIRT", "SAND", "FLESH", "TEETH"],
    CONNECTION_TYPE: ["CONTROL", "RESOURCE"],
    PORT_TYPE: ["INPUT", "OUTPUT"],
    PORT_PLACEMENT: ["TOP", "RIGHT", "BOTTOM", "LEFT"]
}

export default mudConfig({
    deploysDirectory: "./deploys",
    namespace: "mc",
    enums,
    tables: {
        EntityType: "ENTITY_TYPE",
        MachineType: "MACHINE_TYPE",
        MaterialType: "MATERIAL_TYPE",
        ConnectionType: "CONNECTION_TYPE",
        PortType: "PORT_TYPE",
        // ...
        Name: "string",
        Energy: "uint32",
        CarriedBy: "bytes32",
        IsPrototype: "bool",
        Amount: "uint32",
        Temperature: "uint32",
        // ...
        Width: "int32",
        Height: "int32",
        // ...
        PortPlacement: "PORT_PLACEMENT",
        // ...
        SourcePort: "bytes32",
        TargetPort: "bytes32",
        // ...
        CreationBlock: "uint256",
        ReadyBlock: "uint256",
        ClaimBlock: "uint256",
        // ...
        MinCores: "uint32",
        MaxCores: "uint32",
        Level: "uint32",
        Active: "bool",
        LastResolved: "uint256",
        // ...
        Position: {
            valueSchema: {
                x: "int32",
                y: "int32",
            },
        },
        // ...
        GameConfig: {
            keySchema: {},
            valueSchema: {
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
            args: [resolveTableId("EntityType")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("Level")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("Active")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("CarriedBy")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("PortType")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("SourcePort")],
        },
    ],
});
