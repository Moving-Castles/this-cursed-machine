/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import {
  Hex,
  getContract,
  Client,
  Transport,
  Chain,
  Account,
} from "viem"
import { encodeEntity } from "@latticexyz/store-sync/recs"

import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json"
import {
  ContractWrite,
} from "@latticexyz/common"
import { transactionQueue, writeObserver } from "@latticexyz/common/actions"

import { Subject, share } from "rxjs"

import { SetupPublicNetworkResult } from "./setupPublicNetwork"

export type SetupWalletNetworkResult = Awaited<ReturnType<typeof setupWalletNetwork>>

export function setupWalletNetwork(publicNetwork: SetupPublicNetworkResult, walletClient: Client<Transport, Chain, Account>) {
  const networkConfig = publicNetwork.config

  /*
   * Create an observable for contract writes that we can
   * pass into MUD dev tools for transaction observability.
   */
  const write$ = new Subject<ContractWrite>()

  walletClient
    .extend(transactionQueue())
    .extend(writeObserver({ onWrite: write => write$.next(write) }))

  /*
   * Create an object for communicating with the deployed World.
   */
  const worldContract = getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorldAbi,
    client: { public: publicNetwork.publicClient, wallet: walletClient },
  })

  return {
    playerEntity: encodeEntity(
      { address: "address" },
      { address: walletClient.account.address }
    ),
    walletClient,
    worldContract,
    write$: write$.asObservable().pipe(share()),
  }
}
