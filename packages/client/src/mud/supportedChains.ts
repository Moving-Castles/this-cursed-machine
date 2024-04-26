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
import { MUDChain, latticeTestnet, mudFoundry } from "@latticexyz/common/chains"
// import { redstone } from "./redstoneChain";

type ExtendedChain = MUDChain & {
  indexerUrl?: string
}

export const redstoneGarnet = {
  id: 17069,
  name: "Redstone Garnet Testnet",
  network: "redstone-garnet",
  summary: {
    location: "Holesky",
  },
  description: "Redstone Garnet Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Holesky Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.garnet.qry.live"],
      webSocket: ["wss://rpc.garnet.qry.live"],
    },
    public: {
      http: ["https://rpc.garnet.qry.live"],
      webSocket: ["wss://rpc.garnet.qry.live"],
    },
  },
  faucetUrl: "https://17001-faucet.quarry.linfra.xyz/trpc/drip",
  indexerUrl: "https://garnet-indexer.mc-infra.com",
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://explorer.garnet.qry.live",
    },
  },
}

/*
 * See https://mud.dev/tutorials/minimal/deploy#run-the-user-interface
 * for instructions on how to add networks.
 */
export const supportedChains: ExtendedChain[] = [
  mudFoundry,
  latticeTestnet,
  redstoneGarnet,
]
