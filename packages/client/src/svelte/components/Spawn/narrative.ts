import { loadingLine, loadingSpinner, typeWriteToTerminal, writeToTerminal } from "../Terminal/functions/writeToTerminal"
import { OutputType } from "../Terminal/types"
import { SYMBOLS } from "../Terminal"
import { spawn, transfer } from "../../modules/action"
import { waitForCompletion, waitForTransaction } from "../Terminal/functions/helpers"
import { playSound } from "../../modules/sound"

async function writeNarrative(text: string) {
    await typeWriteToTerminal(
        OutputType.SPECIAL,
        text,
        SYMBOLS[7],
        10,
        1000
    )
}

async function writeNarrativeAction(text: string) {
    await typeWriteToTerminal(
        OutputType.INFO,
        text,
        SYMBOLS[7],
        10,
        1000
    )
}

async function writeNarrativeInfo(text: string) {
    await writeToTerminal(
        OutputType.NORMAL,
        text,
        false,
        SYMBOLS[10],
        1000
    )
}

async function writeNarrativeSuccess(text: string) {
    await writeToTerminal(
        OutputType.SUCCESS,
        text,
        false,
        SYMBOLS[10],
        1000
    )
}

export const narrative = [
    async () => {
        await writeNarrative("welcome Stump #24719")
        await writeNarrativeAction("blink if you can hear me")
    },
    async () => {
        await writeNarrative("congratulations on qualifying for a position at TCM’s newest fulfillment centre.")
        await writeNarrative("I am your company assigned Supply Chain Unit Manager (SCUM).")
        await writeNarrative("As is mandatory for your position, all your limbs have been surgically removed to improve capital flow through your biomass.")
        await writeNarrativeAction("blink if the anaesthesia has worn off.")
    },
    async () => {
        await writeNarrative("We are starting the brain-machine-interface calibration process.")
        await writeNarrative("At the end you will receive your first badge.")
        await writeNarrativeAction("Blink again if you understood")
    },
    async () => {
        await writeNarrative("Your consent is important to us.")
        playSound("tcm2", "TRX_wait_a")
        await writeNarrativeInfo("Auto-signing contract (life-time term)")
        playSound("tcm2", "TRX_wait_a")
        await writeNarrativeInfo("Auto-signing non liability agreement (extreme coverage)")
        playSound("tcm2", "TRX_wait_a")
        await writeNarrativeInfo("Auto-signing NDA (maximum penalty)")
        await writeNarrativeInfo("On-boarding in progress...")
        // Send spawn
        const action = spawn()
        await waitForTransaction(action, loadingSpinner);
        await waitForCompletion(action, loadingLine);
        // Spawn complete
        await writeNarrativeSuccess("On-boarding complete")
        await writeNarrative("Congratulations Worker#24")
        await writeNarrative("Brain-machine-interface is now calibrated.")
        await writeNarrative("Blood and piss is being pumped from your body.")
        await writeNarrativeAction("Blink to enter the pod.")
    },
    async () => {
        await writeNarrativeInfo("Transferring worker to pod...")
        // Send spawn
        const action = transfer()
        await waitForTransaction(action, loadingSpinner);
        await waitForCompletion(action, loadingLine);
        await writeNarrativeSuccess("Transfer complete")
    },
]
