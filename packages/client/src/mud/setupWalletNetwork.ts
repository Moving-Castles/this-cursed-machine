/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import {
  Hex,
  parseEther,
  getContract,
  Client,
  PublicClient,
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

  if (networkConfig.faucetServiceUrl) {
    setupDrip(publicNetwork.publicClient, networkConfig.faucetServiceUrl, walletClient.account.address)
  }

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

async function setupDrip(publicClient: PublicClient, faucetServiceUrl: string, address: Hex) {
  /*
   * If there is a faucet, request (test) ETH if you have
   * less than 0.01 ETH. Repeat every 20 seconds to ensure you don't
   * run out.
   */
  console.info("[Dev Faucet]: Player address -> ", address)

  const requestDrip = async () => {
    const balance = await publicClient.getBalance({ address })
    console.info(`[Dev Faucet]: Player balance -> ${balance}`)
    const lowBalance = balance < parseEther("0.01")
    if (faucetServiceUrl && lowBalance) {
      console.info("[Dev Faucet]: Balance is low, dripping funds to player")
      // Drip
      await drip(faucetServiceUrl, address)
    }
  }

  async function drip(url: string, address: string): Promise<void> {
    const data = { address }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await response.json()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  requestDrip()
  setInterval(requestDrip, 20000)
}
