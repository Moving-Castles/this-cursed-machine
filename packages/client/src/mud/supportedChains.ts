/*
 * The supported chains.
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 *
 */
import { MUDChain, mudFoundry, garnet, redstone } from "@latticexyz/common/chains"

type ExtendedChain = MUDChain & {
  indexerUrl?: string | undefined
}

const extendedGarnet: ExtendedChain = garnet as ExtendedChain;
extendedGarnet.faucetUrl = "https://17001-faucet.quarry.linfra.xyz/trpc/drip"
extendedGarnet.indexerUrl = "https://garnet-indexer.mc-infra.com"

const extendedRedstone: ExtendedChain = redstone as ExtendedChain;
extendedRedstone.faucetUrl = "https://redstone-faucet.onrender.com/trpc/drip"
extendedRedstone.indexerUrl = "https://redstone-mainnet-indexer-api.onrender.com/"

export const supportedChains: ExtendedChain[] = [
  mudFoundry,
  extendedGarnet,
  extendedRedstone
]
