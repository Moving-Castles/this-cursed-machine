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
    theme: "dark",
    chain: networkConfig.chain,
    worldAddress: networkConfig.worldAddress,
    // TODO: add gasTank to MUDChain contracts
    // TODO: allow gasTankAddress to be undefined
    // gasTankAddress: networkConfig.chain.contracts?.gasTank?.address as any,
    gasTankAddress: "0x932c23946aba851829553ddd5e22d68b57a81f0d",
    erc4337: false,
    appInfo: {
      name: "This Cursed Machine",
    },
  },
});

import * as Sentry from "@sentry/svelte";

Sentry.init({
  // environment: "staging",
  environment: "development",
  dsn: "https://b051335e30dca124d200533a100e6892@o433904.ingest.us.sentry.io/4507126123921408",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const app = new App({
  target: document.getElementById("app"),
});

export default app;
