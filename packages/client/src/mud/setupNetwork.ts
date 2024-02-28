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
  custom
} from "viem"
import { createFaucetService } from "@latticexyz/services/faucet"
import { encodeEntity, syncToRecs } from "@latticexyz/store-sync/recs"

import { getNetworkConfig } from "./getNetworkConfig"
import { world } from "./world"
import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json"
import {
  createBurnerAccount,
  getContract,
  transportObserver,
  ContractWrite,
} from "@latticexyz/common"

import { tables as extraTables, syncFilters as extraSyncFilters } from "./extraTables";

import { createSyncFilters } from "./createSyncFilters"

import { Subject, share } from "rxjs"

import { toAccount } from "viem/accounts";
import { WindowProvider, configureChains, createConfig } from "@wagmi/core";
import { publicProvider } from "wagmi/providers/public";
import { EIP6963Connector } from "@web3modal/wagmi"

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

export async function setupNetwork() {
  const networkConfig = await getNetworkConfig()

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

  const filters = [...createSyncFilters(null), ...extraSyncFilters];

  /*
   * Sync on-chain state into RECS and keeps our client in sync.
   * Uses the MUD indexer if available, otherwise falls back
   * to the viem publicClient to make RPC calls to fetch MUD
   * events from the chain.
   */
  const { components, latestBlock$ } = await syncToRecs({
    world,
    config: mudConfig,
    address: networkConfig.worldAddress as Hex,
    publicClient,
    indexerUrl: networkConfig.indexerUrl,
    startBlock: BigInt(networkConfig.initialBlockNumber),
    filters,
    tables: extraTables
  })

  /*
  * Create a temporary wallet and a viem client for it
  * (see https://viem.sh/docs/clients/wallet.html).
  */
  const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex);
  const walletClient = createWalletClient({
    ...clientOptions,
    account: burnerAccount,
  });

  /*
   * Create an observable for contract writes that we can
   * pass into MUD dev tools for transaction observability.
   */
  const write$ = new Subject<ContractWrite>()

  /*
   * Create an object for communicating with the deployed World.
   */
  const worldContract = getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorldAbi,
    publicClient,
    walletClient: walletClient,
    onWrite: write => write$.next(write),
  })

  /*
   * If there is a faucet, request (test) ETH if you have
   * less than 1 ETH. Repeat every 20 seconds to ensure you don't
   * run out.
   */
  if (networkConfig.faucetServiceUrl) {
    const address = burnerAccount.address
    console.info("[Dev Faucet]: Player address -> ", address)

    const faucet = createFaucetService(networkConfig.faucetServiceUrl)

    const requestDrip = async () => {
      const balance = await publicClient.getBalance({ address })
      console.info(`[Dev Faucet]: Player balance -> ${balance}`)
      const lowBalance = balance < parseEther("1")
      if (lowBalance) {
        console.info("[Dev Faucet]: Balance is low, dripping funds to player")
        // Double drip
        await faucet.dripDev({ address })
        await faucet.dripDev({ address })
      }
    }

    requestDrip()
    setInterval(requestDrip, 20000)
  }

  const initialiseWallet = async (address: Hex | undefined) => {
    if (!networkConfig.useBurner) {
      if (address) {
        if (window.ethereum && window.ethereum.providers && window.ethereum.providers.length > 1) {
          const metamaskProvider = window.ethereum.providers.find((provider: WindowProvider) => provider.isMetaMask);
          if (metamaskProvider) window.ethereum = metamaskProvider;
        }

        if (!window.ethereum) {
          console.error("No ethereum provider found during wallet initialisation.");
          return;
        }

        const externalWalletClient = createWalletClient({
          chain: networkConfig.chain,
          transport: custom(window.ethereum),
          account: toAccount(address),
        });

        getContract({
          address: networkConfig.worldAddress as Hex,
          abi: IWorldAbi,
          publicClient,
          walletClient: externalWalletClient,
          onWrite: (write) => {
            write$.next(write);
            // const { writes } = useStore.getState();
            // useStore.setState({ writes: [...writes, write] });
          },
        });

        // useStore.setState({ externalWalletClient, externalWorldContract });
      } else {
        // useStore.setState({ externalWalletClient: null, externalWorldContract: null });
      }
    }
  };

  // If flag is set, use the burner key as the "External" wallet
  // if (networkConfig.useBurner) {
  //   const externalWalletClient = walletClient;
  //   const externalWorldContract = worldContract;
  //   // useStore.setState({ externalWalletClient, externalWorldContract });
  // }

  const { chain } = publicClient;

  const chainCopy = { ...chain };

  if (chainCopy.fees) {
    delete chainCopy.fees; // Delete the BigInt property as it cannot be serialised by Wagmi
  }

  const { chains } = configureChains([chainCopy], [publicProvider()]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new EIP6963Connector({ chains }),
    ],
    publicClient,
  })

  // Allows us to to only listen to the game sepcific tables
  const tableKeys = [...Object.keys(mudConfig.tables), ...Object.keys(extraTables)];

  return {
    world,
    components,
    playerEntity: encodeEntity(
      { address: "address" },
      { address: walletClient.account.address }
    ),
    publicClient,
    walletClient,
    worldContract,
    latestBlock$,
    write$: write$.asObservable().pipe(share()),
    initialiseWallet,
    chains,
    wagmiConfig,
    tableKeys
  }
}
