/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import {
  fallback,
  webSocket,
  http,
  createWalletClient,
  Hex,
  ClientConfig,
} from "viem"

import {
  createBurnerAccount,
  transportObserver,
} from "@latticexyz/common"

import { setupWalletNetwork } from "./setupWalletNetwork"
import { SetupPublicNetworkResult } from "./setupPublicNetwork"

export function setupBurnerWalletNetwork(publicNetwork: SetupPublicNetworkResult) {
  const networkConfig = publicNetwork.config

  /*
   * Create a temporary wallet and a viem client for it
   * (see https://viem.sh/docs/clients/wallet.html).
   */
  const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex)

  // For debugging purposes
  console.log("*** BURNER ACCOUNT PRIVATE KEY =>", networkConfig.privateKey)

  /*
   * Create a viem public (read only) client
   * (https://viem.sh/docs/clients/public.html)
   */
  const clientOptions = {
    chain: networkConfig.chain,
    transport: transportObserver(fallback([webSocket(), http()])),
    pollingInterval: 1000,
  } as const satisfies ClientConfig

  const burnerWalletClient = createWalletClient({
    ...clientOptions,
    account: burnerAccount,
  })

  return setupWalletNetwork(publicNetwork, burnerWalletClient)
}
