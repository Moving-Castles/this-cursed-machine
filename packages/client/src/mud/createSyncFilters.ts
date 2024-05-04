import { resourceToHex } from "@latticexyz/common";
import { Entity } from "@latticexyz/recs";
import { SyncFilter } from "@latticexyz/store-sync";
import mudConfig from "contracts/mud.config";
// import { Hex } from "viem";

// const GLOBAL_TABLES = ["Order", "Offer", "Recipe", "GameConfig", "MaterialMetadata", "EntityType"]

// const filteredTables = Object.values(mudConfig.tables).filter((table) => GLOBAL_TABLES.includes(table.name));

// console.log('mudConfig.namespace', mudConfig.namespace)

// const syncTables = filteredTables.map((table) => {
//     console.log("table", table)
//     const tableId = resourceToHex({
//         type: "table",
//         namespace: mudConfig.namespace,
//         name: table.name,
//     });
//     console.log('table.name', table.name)
//     console.log("tableId", tableId)
//     console.log('table.tableId', table.tableId)
//     return { tableId: tableId };
// });

// console.log("syncTables", syncTables)

const allTables = Object.values(mudConfig.tables).map((table) => {
    const tableId = resourceToHex({
        type: "table",
        namespace: mudConfig.namespace,
        name: table.name,
    });
    return { tableId: tableId };
});


export function createSyncFilters(podEntity: Entity | null): SyncFilter[] {
    return allTables;
}
