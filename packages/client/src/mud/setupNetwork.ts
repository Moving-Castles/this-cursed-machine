/*
 * The MUD client code is built on top of viem
 * (https://viem.sh/docs/getting-started.html).
 * This line imports the functions we need from it.
 */
import {
  createPublicClient,
  fallback,
  webSocket,
  http,
  createWalletClient,
  Hex,
  parseEther,
  ClientConfig,
  getContract,
} from "viem"
import { encodeEntity, syncToRecs } from "@latticexyz/store-sync/recs"

import { getNetworkConfig } from "./getNetworkConfig"
import { world } from "./world"
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json"
import {
  createBurnerAccount,
  transportObserver,
  ContractWrite,
} from "@latticexyz/common"
import { transactionQueue, writeObserver } from "@latticexyz/common/actions"

import {
  tables as extraTables,
  syncFilters as extraSyncFilters,
} from "./extraTables"
import { createSyncFilters } from "./createSyncFilters"

import { Subject, share } from "rxjs"

import { ENVIRONMENT } from "./enums"

/*
 * Import our MUD config, which includes strong types for
 * our tables and other config options. We use this to generate
 * things like RECS components and get back strong types for them.
 *
 * See https://mud.dev/templates/typescript/contracts#mudconfigts
 * for the source of this information.
 */
import mudConfig from "contracts/mud.config"

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>

export async function setupNetwork(environment: ENVIRONMENT) {
  const networkConfig = await getNetworkConfig(environment)

  const filters = [...createSyncFilters(null), ...extraSyncFilters]

  /*
   * Create a viem public (read only) client
   * (https://viem.sh/docs/clients/public.html)
   */
  const clientOptions = {
    chain: networkConfig.chain,
    transport: transportObserver(fallback([webSocket(), http()])),
    pollingInterval: 1000,
  } as const satisfies ClientConfig

  const publicClient = createPublicClient(clientOptions)

  /*
   * Create an observable for contract writes that we can
   * pass into MUD dev tools for transaction observability.
   */
  const write$ = new Subject<ContractWrite>()

  /*
   * Create a temporary wallet and a viem client for it
   * (see https://viem.sh/docs/clients/wallet.html).
   */
  const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex)

  // For debugging purposes
  console.log("*** BURNER ACCOUNT PRIVATE KEY =>", networkConfig.privateKey)

  const burnerWalletClient = createWalletClient({
    ...clientOptions,
    account: burnerAccount,
  })
    .extend(transactionQueue())
    .extend(writeObserver({ onWrite: write => write$.next(write) }))

  /*
   * Create an object for communicating with the deployed World.
   */
  const worldContract = getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorldAbi,
    client: { public: publicClient, wallet: burnerWalletClient },
  })

  /*
   * Sync on-chain state into RECS and keeps our client in sync.
   * Uses the MUD indexer if available, otherwise falls back
   * to the viem publicClient to make RPC calls to fetch MUD
   * events from the chain.
   */
  const { components, latestBlock$, storedBlockLogs$, waitForTransaction } =
    await syncToRecs({
      world,
      config: mudConfig,
      address: networkConfig.worldAddress as Hex,
      publicClient,
      startBlock: BigInt(networkConfig.initialBlockNumber),
      indexerUrl: networkConfig.indexerUrl,
      filters,
      tables: extraTables,
    })

  /*
   * If there is a faucet, request (test) ETH if you have
   * less than 0.01 ETH. Repeat every 20 seconds to ensure you don't
   * run out.
   */
  if (networkConfig.faucetServiceUrl) {
    const address = burnerAccount.address
    console.info("[Dev Faucet]: Player address -> ", address)

    const requestDrip = async () => {
      const balance = await publicClient.getBalance({ address })
      console.info(`[Dev Faucet]: Player balance -> ${balance}`)
      const lowBalance = balance < parseEther("0.01")
      if (networkConfig.faucetServiceUrl && lowBalance) {
        console.info("[Dev Faucet]: Balance is low, dripping funds to player")
        // Drip
        await drip(networkConfig.faucetServiceUrl, address)
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

  // Allows us to to only listen to the game sepcific tables
  const tableKeys = [
    ...Object.keys(mudConfig.tables),
    ...Object.keys(extraTables),
  ]

  return {
    config: networkConfig,
    worldAddress: networkConfig.worldAddress,
    world,
    components,
    playerEntity: encodeEntity(
      { address: "address" },
      { address: burnerWalletClient.account.address }
    ),
    publicClient,
    walletClient: burnerWalletClient,
    latestBlock$,
    storedBlockLogs$,
    waitForTransaction,
    worldContract,
    write$: write$.asObservable().pipe(share()),
    tableKeys,
  }
}
