import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
    deploysDirectory: "./deploys",
    namespace: "mc",
    enums: {
        ENTITY_TYPE: ["BOX", "CORE", "MACHINE", "CONNECTION", "MATERIAL", "PORT"],
        MACHINE_TYPE: ["BLOCKER", "INLET", "OUTLET", "BLENDER", "SPLITTER", "SCORCHER"],
        MATERIAL_TYPE: ["PELLET", "BLOOD", "PISS", "DIRT", "SAND", "FLESH"],
        CONNECTION_TYPE: ["CONTROL", "RESOURCE"],
        PORT_TYPE: ["INPUT", "OUTPUT"],
        PORT_PLACEMENT: ["TOP", "RIGHT", "BOTTOM", "LEFT"],
        ROTATION: ["DEG0", "DEG90", "DEG180", "DEG270"]
    },
    tables: {
        EntityType: "ENTITY_TYPE",
        MachineType: "MACHINE_TYPE",
        MaterialType: "MATERIAL_TYPE",
        ConnectionType: "CONNECTION_TYPE",
        PortType: "PORT_TYPE",
        // ...
        Name: "string",
        CarriedBy: "bytes32",
        IsPrototype: "bool",
        // ...
        Width: "int32",
        Height: "int32",
        // ...
        PortPlacement: "PORT_PLACEMENT",
        // ...
        SourcePort: "bytes32",
        TargetPort: "bytes32",
        // ...
        Rotation: "ROTATION",
        // ...
        CreationBlock: "uint256",
        ReadyBlock: "uint256",
        ClaimBlock: "uint256",
        // ...
        MinCores: "uint32",
        MaxCores: "uint32",
        Level: "uint32",
        Active: "bool",
        // ...
        Position: {
            schema: {
                x: "int32",
                y: "int32",
            },
        },
        // ...
        GameConfig: {
            keySchema: {},
            schema: {
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
        // {
        //     name: "KeysWithValueModule",
        //     root: true,
        //     args: [resolveTableId("Position")],
        // },
        // {
        //     name: "KeysInTableModule",
        //     root: true,
        //     args: [resolveTableId("ClaimBlock")],
        // }
    ],
});
