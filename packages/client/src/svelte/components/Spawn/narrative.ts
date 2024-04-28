import { get } from "svelte/store";
import {
  loadingLine,
  loadingSpinner,
  typeWriteToTerminal,
  writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal";
import { TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { SYMBOLS } from "@components/Main/Terminal";
import { spawn, start } from "@modules/action";
import {
  waitForCompletion,
  waitForTransaction,
} from "@modules/action/actionSequencer/utils";
import { playSound } from "@modules/sound";
import { playerAddress } from "@svelte/modules/state/base/stores";
import { renderNaming } from "@components/Main/Terminal/functions/renderNaming";
import { publicNetwork, walletNetwork } from "@modules/network";
import { setupWalletNetwork } from "@mud/setupWalletNetwork";
import { setupBurnerWalletNetwork } from "@mud/setupBurnerWalletNetwork";
import { ENVIRONMENT } from "@mud/enums";
import { connect } from "@components/Spawn/account-kit-connect";
import { initSignalNetwork } from "@modules/signal"

async function writeNarrative(text: string) {
  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.NORMAL,
    text,
    SYMBOLS[7],
    10,
    800
  );
}

async function writeNarrativeAction(text: string) {
  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.ALERT,
    text,
    SYMBOLS[7],
    10,
    800
  );
}

async function writeNarrativeInfo(text: string) {
  await writeToTerminal(
    TERMINAL_OUTPUT_TYPE.INFO,
    text,
    false,
    SYMBOLS[16],
    800
  );
}

async function writeNarrativeSuccess(text: string) {
  await writeToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    text,
    false,
    SYMBOLS[10],
    800
  );
}

async function typeWriteNarrativeSuccess(text: string) {
  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    text,
    SYMBOLS[15],
    10,
    800
  );
}

export const narrative = [
  // async (_: ENVIRONMENT) => {
  //   await writeNarrative("welcome stump");
  //   await writeNarrativeAction("blink if you can hear me");
  // },
  // async (_: ENVIRONMENT) => {
  //   await writeNarrative(
  //     "congratulations on qualifying for a position at TCM’s newest fulfilment centre."
  //   );
  //   await writeNarrative(
  //     "I am your company assigned Supply Chain Unit Manager (S.C.U.M)."
  //   );
  //   await writeNarrative("I will help you through the on-boarding process.");
  //   await writeNarrativeAction("blink to begin");
  // },
  async (_: ENVIRONMENT) => {
    await writeNarrative("the company needs to verify your identity.");
    await writeNarrativeAction("blink to start verification");
  },
  async (environment: ENVIRONMENT) => {
    if ([
      ENVIRONMENT.DEVELOPMENT,
      ENVIRONMENT.GARNET, // Using burner/faucet on garnet for the time being
    ].includes(environment)) {
      // Burner
      walletNetwork.set(setupBurnerWalletNetwork(get(publicNetwork)));
    } else {
      // Account kit
      await writeNarrative("[Wallet connection started here]");
      const appAccountClient = await connect();
      walletNetwork.set(setupWalletNetwork(get(publicNetwork), appAccountClient));
    }

    // Websocket connection for off-chain messaging
    initSignalNetwork()

    await writeNarrative("Your account address is:");
    await typeWriteNarrativeSuccess(get(playerAddress));
    await writeNarrativeAction("blink to continue");
  },
  async (_: ENVIRONMENT) => {
    await writeNarrative(
      "you can (mandatory) assign yourself a human-readable ID (name)"
    );
    // Trigger naming input
    let name: string | null = null;
    while (!name) {
      name = await renderNaming(
        document.getElementById("custom-input-container") as HTMLDivElement
      );
    }
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.COMMAND,
      name,
      false,
      SYMBOLS[1]
    );
    await writeNarrative(`${name}, your consent is important to us.`);
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("Auto-signing contract (life-time term)");
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo(
      "Auto-signing non liability agreement (extreme coverage)"
    );
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("Auto-signing NDA (maximum penalty)");
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("Beginning devolutionary brain surgery...");
    // Send spawn
    const action = spawn(name);
    await waitForTransaction(action, loadingSpinner);
    await waitForCompletion(action, loadingLine);
    playSound("tcm", "TRX_yes");
    // Spawn complete
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("all limbs removed");
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("hippocampus cauterised");
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("former self erased");
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("brain-machine-interface calibrated");
    await writeNarrativeAction("blink when the anaesthesia has worn off");
  },
  async (_: ENVIRONMENT) => {
    await writeNarrative("from now on");
    await writeNarrative("only one thing matters");
    playSound("tcm", "bugs");
    await writeNarrativeSuccess("$BUGS");
    await writeNarrative("for them you will live in the pod");
    await writeNarrative("for them you will fulfill your orders");
    await writeNarrative("for them you will stomp on other stumps");
    playSound("tcm", "bugs");
    await writeNarrativeSuccess("$BUGS");
    playSound("tcm", "bugs");
    await writeNarrativeSuccess("$BUGS");
    playSound("tcm", "bugs");
    await writeNarrativeSuccess("$BUGS");
    await writeNarrative("life is a $bugs sucking slot machine on steroids");
    await writeNarrative("Do not disappoint me.");
    await writeNarrativeAction("blink to enter the pod.");
  },
  async (_: ENVIRONMENT) => {
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("transferring stump to pod...");
    // Send spawn
    const action = start();
    await waitForTransaction(action, loadingSpinner);
    await waitForCompletion(action, loadingLine);
    playSound("tcm", "enteredPod");
    await writeNarrativeSuccess("transfer complete");
  },
];
