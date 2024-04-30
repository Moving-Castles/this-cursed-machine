/*
 * The supported chains.
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 *
 */
import {
  MUDChain,
  mudFoundry,
  garnet,
  redstone,
} from "@latticexyz/common/chains";
import { holesky, mainnet } from "viem/chains";

type ExtendedChain = MUDChain & {
  indexerUrl?: string | undefined;
};

const extendedGarnet = {
  ...garnet,
  faucetUrl: "https://17001-faucet.quarry.linfra.xyz/trpc/drip",
  indexerUrl: "https://indexer.mud.garnetchain.com/",
} as const satisfies ExtendedChain;

const extendedRedstone = {
  ...redstone,
  faucetUrl: "https://redstone-faucet.onrender.com/trpc/drip",
  indexerUrl: "https://indexer.mud.redstonechain.com/",
} as const satisfies ExtendedChain;

export const supportedChains = [
  mudFoundry,
  extendedGarnet,
  extendedRedstone,
  holesky,
  mainnet,
] as const;
