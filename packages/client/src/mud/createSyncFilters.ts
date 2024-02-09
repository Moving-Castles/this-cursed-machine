import { resourceToHex } from "@latticexyz/common";
import { Entity } from "@latticexyz/recs";
import { SyncFilter } from "@latticexyz/store-sync";
import mudConfig from "contracts/mud.config";
// import { Hex } from "viem";

const tables = Object.values(mudConfig.tables).map((table) => {
    const tableId = resourceToHex({
        type: table.offchainOnly ? "offchainTable" : "table",
        // TODO: update once this multiple namespaces is supported (https://github.com/latticexyz/mud/issues/994)
        namespace: mudConfig.namespace,
        name: table.name,
    });
    return { tableId: tableId };
});

// const matchSpecificTables = tables.filter((table) => {
//   const keyNames = Object.keys(table.keySchema);
//   return keyNames[0] === "matchEntity" && keyNames[1] === "entity";
// });

export function createSyncFilters(podEntity: Entity | null): SyncFilter[] {
    return tables;
}
