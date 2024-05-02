import { writable, derived } from "svelte/store";
import { SetupPublicNetworkResult } from "@mud/setupPublicNetwork";
import { SetupWalletNetworkResult } from "@mud/setupWalletNetwork";

// ----------------------------------------------------------------------------

export { initBlockListener } from "./blockListener";

// --- STORES -----------------------------------------------------------------

export const publicNetwork = writable({} as SetupPublicNetworkResult);
export const walletNetwork = writable({} as SetupWalletNetworkResult);
export const blockNumber = writable(BigInt(0));
export const ready = writable(false);
export const loadingMessage = writable("Loading");

export const accountKitWalletBalance =
    derived([publicNetwork, walletNetwork], async ([$publicNetwork, $walletNetwork]) => {

        if (!$walletNetwork?.walletClient?.account?.address) return 0;
        if (!$publicNetwork?.publicClient?.getBalance) return 0;

        console.log('$publicNetwork', $publicNetwork);

        const balance = await $publicNetwork.publicClient.getBalance({
            address: $walletNetwork.walletClient.account.address,
        })

        return balance;
    });
