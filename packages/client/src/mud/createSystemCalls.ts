import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import type { ClientComponents } from "./createClientComponents";
import type { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
    { Counter }: ClientComponents
) {
    const increment = async () => {
        const tx = await worldSend("increment", []);
        await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
        return getComponentValue(Counter, singletonEntity);
    };

    return {
        increment,
    };
}
