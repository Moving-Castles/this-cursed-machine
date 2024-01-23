/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - latticeTestnet, our public test network.
 *
 */
import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains";

type ExtendedChain = MUDChain & {
    indexerUrl?: string;
};

const redstoneHolesky = {
    id: 17001,
    name: "Redstone Holesky",
    network: "redstone-holesky",
    summary: {
        location: "Holesky",
    },
    description: "Redstone Holesky",
    nativeCurrency: {
        decimals: 18,
        name: "Holesky Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.holesky.redstone.xyz"],
            webSocket: ["wss://rpc.holesky.redstone.xyz/ws"],
        },
        public: {
            http: ["https://rpc.holesky.redstone.xyz"],
            webSocket: ["wss://rpc.holesky.redstone.xyz/ws"],
        },
    },
    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://explorer.holesky.redstone.xyz",
        },
    },
    // faucetUrl: "https://17001-faucet.quarry.linfra.xyz/trpc",
    indexerUrl: "https://17001-postgres-indexer.quarry.linfra.xyz",
    testnet: true,
};

/*
 * See https://mud.dev/tutorials/minimal/deploy#run-the-user-interface
 * for instructions on how to add networks.
 */
export const supportedChains: ExtendedChain[] = [mudFoundry, latticeTestnet, redstoneHolesky];
