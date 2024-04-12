import { resourceToHex } from "@latticexyz/common";
import { SyncFilter } from "@latticexyz/store-sync";

const TokenBalancesTableId = resourceToHex({ type: "table", namespace: "BugToken", name: "Balances" });


export const syncFilters: SyncFilter[] = [
    {
        tableId: TokenBalancesTableId,
    },
];


export const tables = {
    Token_Balances: {
        namespace: "BugToken",
        name: "Balances",
        tableId: TokenBalancesTableId,
        keySchema: {
            account: { type: "address" },
        },
        valueSchema: {
            value: { type: "uint256" },
        },
    },

} as const;
