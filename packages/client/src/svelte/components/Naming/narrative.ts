import { loadingLine, loadingSpinner, typeWriteToTerminal, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
import { TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { SYMBOLS } from "@components/Main/Terminal"
import { name } from "@modules/action"
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound"

async function writeNarrative(text: string) {
    await typeWriteToTerminal(
        TERMINAL_OUTPUT_TYPE.SPECIAL,
        text,
        SYMBOLS[7],
        10,
        800
    )
}

async function writeNarrativeAction(text: string) {
    await typeWriteToTerminal(
        TERMINAL_OUTPUT_TYPE.INFO,
        text,
        SYMBOLS[7],
        10,
        800
    )
}

async function writeNarrativeInfo(text: string) {
    await writeToTerminal(
        TERMINAL_OUTPUT_TYPE.NORMAL,
        text,
        false,
        SYMBOLS[10],
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

async function writeNarrativeError(text: string) {
    await writeToTerminal(
        TERMINAL_OUTPUT_TYPE.ERROR,
        text,
        false,
        "!",
        800
    )
}


export const narrative = [
    async () => {
        await writeNarrative("congratulations on completing the on-boarding.")
        await writeNarrative('You are a now a full time (168 hour week) employee of TCM.')
        await writeNarrative('You are allowed to assign yourself a human readable ID (name).')
        await writeNarrativeAction("Enter your name (Must include at least one numeral and one special character).")
    },
    async (str: string) => {
        await writeNarrativeInfo("Permanently erasing old identity...")
        await writeNarrativeError("WARNING: THIS CAN NOT BE UNDONE")
        await writeNarrativeInfo("Assigning new name...")
        const action = name(str)
        await waitForTransaction(action, loadingSpinner);
        await waitForCompletion(action, loadingLine);
        playSound("tcm", "TRX_yes")
        await writeNarrativeSuccess("Name assigned")
    },
]