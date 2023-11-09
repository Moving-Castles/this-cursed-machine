import { loadingLine, loadingSpinner, typeWriteToTerminal, writeToTerminal } from "../Terminal/functions/writeToTerminal"
import { OutputType } from "../Terminal/types"
import { SYMBOLS } from "../Terminal"
import { spawn, restart } from "../../modules/action"
import { waitForCompletion, waitForTransaction } from "../Terminal/functions/helpers"
import { playSound } from "../../modules/sound"

async function writeNarrative(text: string) {
    await typeWriteToTerminal(
        OutputType.SPECIAL,
        text,
        SYMBOLS[7],
        10,
        800
    )
}

async function writeNarrativeAction(text: string) {
    await typeWriteToTerminal(
        OutputType.INFO,
        text,
        SYMBOLS[7],
        10,
        800
    )
}

async function writeNarrativeInfo(text: string) {
    await writeToTerminal(
        OutputType.NORMAL,
        text,
        false,
        SYMBOLS[10],
        800
    )
}

async function writeNarrativeSuccess(text: string) {
    await writeToTerminal(
        OutputType.SUCCESS,
        text,
        false,
        SYMBOLS[10],
        800
    )
}

export const narrative = [
    async () => {
        await writeNarrative("welcome stump")
        await writeNarrativeAction("blink if you can hear me")
    },
    async () => {
        await writeNarrative("congratulations on qualifying for a position at TCM’s newest fulfillment centre.")
        await writeNarrative("I am your company assigned Supply Chain Unit Manager (S.C.U.M).")
        await writeNarrative("I will help you through the on-boarding process.")
        await writeNarrativeAction("blink to begin")
    },
    async () => {
        await writeNarrative("Your consent is important to us.")
        playSound("tcm", "TRX_wait_a")
        await writeNarrativeInfo("Auto-signing contract (life-time term)")
        playSound("tcm", "TRX_wait_a")
        await writeNarrativeInfo("Auto-signing non liability agreement (extreme coverage)")
        playSound("tcm", "TRX_wait_a")
        await writeNarrativeInfo("Auto-signing NDA (maximum penalty)")
        await writeNarrativeInfo("Beginning surgery...")
        // Send spawn
        const action = spawn()
        await waitForTransaction(action, loadingSpinner);
        await waitForCompletion(action, loadingLine);
        playSound("tcm", "TRX_yes")
        // Spawn complete
        await writeNarrativeInfo("all limbs removed")
        await writeNarrativeInfo("capital flow through biomass improved")
        await writeNarrativeInfo("straitjacket applied")
        await writeNarrativeInfo("brain-machine-interface calibrated")
        await writeNarrativeAction("blink when the anaesthesia has worn off")
    },
    async () => {
        await writeNarrative("From now on,")
        await writeNarrative("you will eat the bugs,")
        await writeNarrative("you will live in the pod,")
        await writeNarrative("you will fulfill your orders.")
        await writeNarrative("Do not disappoint me.")
        await writeNarrativeAction("Blink to enter the pod.")
    },
    async () => {
        await writeNarrativeInfo("Transferring stump to pod...")
        // Send spawn
        const action = restart()
        await waitForTransaction(action, loadingSpinner);
        await waitForCompletion(action, loadingLine);
        playSound("tcm", "enteredPod")
        await writeNarrativeSuccess("Transfer complete")
    },
]
