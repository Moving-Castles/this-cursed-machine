import "./app.css";
import App from "./App.svelte";
import { mount as mountAccountKit } from "@latticexyz/account-kit/bundle";
import { createConfig } from "@wagmi/core";
import { getNetworkConfig } from "@mud/getNetworkConfig";
import { ENVIRONMENT } from "@mud/enums";
import { supportedChains } from "@mud/supportedChains";
import { MUDChain } from "@latticexyz/common/chains";
import { transportObserver } from "@latticexyz/common";
import { fallback, http, webSocket } from "viem";

const networkConfig = getNetworkConfig(ENVIRONMENT.DEVELOPMENT);
const wagmiConfig = createConfig({
  // chains: [networkConfig.chain as Chain],
  chains: supportedChains as [MUDChain, ...MUDChain[]],
  pollingInterval: 1_000,
  // TODO: how to properly set up a transport config for all chains supported as bridge sources?
  transports: Object.fromEntries(
    supportedChains.map((chain) => {
      if (chain.rpcUrls.default.webSocket)
        return [chain.id, transportObserver(fallback([http(), webSocket()]))];
      return [chain.id, transportObserver(fallback([http()]))];
    })
  ),
});

mountAccountKit({
  wagmiConfig,
  accountKitConfig: {
    chain: networkConfig.chain,
    worldAddress: networkConfig.worldAddress,
    // TODO: add gasTank to MUDChain contracts
    // TODO: allow gasTankAddress to be undefined
    gasTankAddress: networkConfig.chain.contracts?.gasTank?.address as any,
    appInfo: {
      name: "Get Shit Done",
    },
  },
});

const app = new App({
  target: document.getElementById("app"),
});

export default app;
