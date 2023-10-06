import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export const enums = {
    ENTITY_TYPE: ["NONE", "LEVEL", "BOX", "MACHINE", "CONNECTION", "MATERIAL", "PORT"],
    MACHINE_TYPE: ["NONE", "INLET", "OUTLET", "CORE", "SPLITTER", "MIXER", "DRYER", "WETTER", "BOILER", "COOLER"],
    MATERIAL_TYPE: ["NONE", "BUG", "PISS", "BLOOD", "PRIME", "M150ED", "BANG", "MONSTER", "CLUB_MATE", "SPRITE", "MILK", "JUGGERNOG", "TABASCO", "IBUPROFENE", "AMMONIA", "NYQUIL"],
    PORT_TYPE: ["INPUT", "OUTPUT"]
}

export default mudConfig({
    deploysDirectory: "./deploys",
    enums,
    tables: {
        EntityType: "ENTITY_TYPE",
        MachineType: "MACHINE_TYPE",
        MaterialType: "MATERIAL_TYPE",
        PortType: "PORT_TYPE",
        Name: "string",
        Energy: "uint32",
        CarriedBy: "bytes32",
        Amount: "uint32",
        SourcePort: "bytes32",
        TargetPort: "bytes32",
        CreationBlock: "uint256",
        ReadyBlock: "uint256",
        Level: "uint32",
        LastResolved: "uint256",
        // ...
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
            args: [resolveTableId("PortType")],
        },
        {
            name: "KeysWithValueModule",
            root: true,
            args: [resolveTableId("SourcePort")],
        },
    ],
});
