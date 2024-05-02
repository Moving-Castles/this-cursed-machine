import { get } from "svelte/store"
import { tutorialProgress } from "@modules/ui/assistant"
import {
  loadingLine,
  loadingSpinner,
  typeWriteToTerminal,
  writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import { TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { SYMBOLS } from "@components/Main/Terminal"
import { spawn, start } from "@modules/action"
import {
  waitForCompletion,
  waitForTransaction,
} from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound"
import { playerAddress, player } from "@svelte/modules/state/base/stores"
import {
  discoveredMaterials,
  discoveredMessages,
} from "@modules/state/simulated/stores"
import { tutorialProgress } from "@modules/ui/assistant"
import { renderNaming } from "@components/Main/Terminal/functions/renderNaming"
import { publicNetwork, walletNetwork } from "@modules/network"
import { setupWalletNetwork } from "@mud/setupWalletNetwork"
import { ENVIRONMENT } from "@mud/enums"
import { initSignalNetwork } from "@modules/signal"
import { connect } from "./account-kit-connect"
import type { AccountKitConnectReturn } from "./account-kit-connect/types"

async function writeNarrative(text: string) {
  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.NORMAL,
    text,
    SYMBOLS[7],
    10,
    800
  )
}

async function writeNarrativeAction(text: string) {
  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.ALERT,
    text,
    SYMBOLS[7],
    10,
    800
  )
}

async function writeNarrativeInfo(text: string) {
  await writeToTerminal(
    TERMINAL_OUTPUT_TYPE.INFO,
    text,
    false,
    SYMBOLS[16],
    800
  )
}

async function writeNarrativeSuccess(text: string) {
  await writeToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    text,
    false,
    SYMBOLS[10],
    800
  )
}

async function typeWriteNarrativeSuccess(text: string) {
  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    text,
    SYMBOLS[15],
    10,
    800
  )
}

async function writeFailure(text: string) {
  await writeToTerminal(
    TERMINAL_OUTPUT_TYPE.ERROR,
    text,
    false,
    SYMBOLS[7],
    800
  )
}

export const narrative = [
  // async (_: ENVIRONMENT): Promise<boolean> => {
  //   await writeNarrativeAction("blink if you can hear me");
  //   return true;
  // },
  async (_: ENVIRONMENT): Promise<boolean> => {
    await writeNarrative("welcome stump")
    await writeNarrative("the company needs to verify your identity.")
    await writeNarrativeAction("blink to start verification")
    return true
  },
  async (environment: ENVIRONMENT): Promise<boolean> => {
    if (
      [
        ENVIRONMENT.DEVELOPMENT,
        ENVIRONMENT.GARNET, // Using burner/faucet on garnet for the time being
      ].includes(environment)
    ) {
      // Burner wallet already initialized in Spawn component
      await typeWriteNarrativeSuccess("No verification required.")
    } else {
      // Account kit
      await writeNarrative("Starting verification process...")

      let accountKitConnectReturn: AccountKitConnectReturn | null = null

      while (!accountKitConnectReturn) {
        try {
          accountKitConnectReturn = await connect()
        } catch (e) {
          console.log("Account kit error", e)
          await writeFailure(
            "Stump must complete the verification process to proceed."
          )
        }
      }

      console.log("accountKitConnectReturn", accountKitConnectReturn)
      walletNetwork.set(
        setupWalletNetwork(
          get(publicNetwork),
          accountKitConnectReturn.appAccountClient
        )
      )
      // Set player address to main wallet address
      playerAddress.set(accountKitConnectReturn.userAddress)
    }

    // Reset stores for the UI
    tutorialProgress.set(0)
    discoveredMaterials.set(["0x745f425547530000000000000000"])
    discoveredMessages.set([])

    // Websocket connection for off-chain messaging
    initSignalNetwork()

    await writeNarrative("Your address is:")
    await typeWriteNarrativeSuccess(get(playerAddress))
    await writeNarrativeAction("blink to continue")

    // If the player is spawned and started, return false to skip
    if (get(player)?.carriedBy) {
      const name = get(player)?.name ?? "stump #" + get(player).spawnIndex
      await writeNarrative(`Welcome back, ${name}`)
      await writeNarrative("Transferring to pod...")
      await new Promise(resolve => setTimeout(resolve, 800))
      return false
    }
    return true
  },
  async (_: ENVIRONMENT): Promise<boolean> => {
    await writeNarrative(
      "congratulations on qualifying for a position at TCM’s newest fulfilment centre."
    )
    await writeNarrative(
      "I am your company assigned Supply Chain Unit Manager (S.C.U.M)."
    )
    await writeNarrative("I will help you through the on-boarding process.")
    await writeNarrativeAction("blink to begin")
    return true
  },
  async (_: ENVIRONMENT): Promise<boolean> => {
    await writeNarrative(
      "you can (mandatory) assign yourself a human-readable ID (name)"
    )
    // Trigger naming input
    let name: string | null = null
    while (!name) {
      name = await renderNaming(
        document.getElementById("custom-input-container") as HTMLDivElement
      )
    }
    await writeToTerminal(TERMINAL_OUTPUT_TYPE.COMMAND, name, false, SYMBOLS[1])
    await writeNarrative(`${name}, your consent is important to us.`)
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("Auto-signing contract (life-time term)")
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo(
      "Auto-signing non liability agreement (extreme coverage)"
    )
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("Auto-signing NDA (maximum penalty)")
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("Beginning devolutionary brain surgery...")
    // Send spawn
    const action = spawn(name)
    await waitForTransaction(action, loadingSpinner)
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "TRX_yes")
    // Spawn complete
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("all limbs removed")
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("hippocampus cauterised")
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("former self erased")
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("brain-machine-interface calibrated")
    await writeNarrativeAction("blink when the anaesthesia has worn off")
    return true
  },
  async (_: ENVIRONMENT): Promise<boolean> => {
    await writeNarrative("from now on")
    await writeNarrative("only one thing matters")
    playSound("tcm", "bugs")
    await writeNarrativeSuccess("$BUGS")
    await writeNarrative("for them you will live in the pod")
    await writeNarrative("for them you will fulfill your orders")
    await writeNarrative("for them you will stomp on other stumps")
    playSound("tcm", "bugs")
    await writeNarrativeSuccess("$BUGS")
    playSound("tcm", "bugs")
    await writeNarrativeSuccess("$BUGS")
    playSound("tcm", "bugs")
    await writeNarrativeSuccess("$BUGS")
    await writeNarrative("life is a $bugs sucking slot machine on steroids")
    await writeNarrative("Do not disappoint me.")
    await writeNarrativeAction("blink to enter the pod.")
    return true
  },
  async (_: ENVIRONMENT): Promise<boolean> => {
    playSound("tcm", "textLineHit")
    await writeNarrativeInfo("transferring stump to pod...")
    // Send spawn
    const action = start()
    await waitForTransaction(action, loadingSpinner)
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "enteredPod")
    await writeNarrativeSuccess("transfer complete")
    return true
  },
]
