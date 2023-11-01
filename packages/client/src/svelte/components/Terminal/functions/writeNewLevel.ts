import { typeWriteToTerminal, writeToTerminal } from "./writeToTerminal"
import { OutputType } from "../types"
import { SYMBOLS } from ".."
import { get } from "svelte/store"
import { playerGoals } from "../../../modules/state"
import { MaterialType } from "../../../modules/state/enums"
import { staticContent } from "../../../modules/content"
import { extractTexts } from "../../../modules/content/sanity"

async function typeWrite(text: string) {
    await typeWriteToTerminal(
        OutputType.SPECIAL,
        text,
        SYMBOLS[7],
        10,
        100
    )
}

async function write(text: string) {
    await writeToTerminal(
        OutputType.INFO,
        text,
        false,
        SYMBOLS[7],
        100
    )
}

async function writeAction(text: string) {
    await writeToTerminal(
        OutputType.ERROR,
        text,
        false,
        SYMBOLS[7],
        100
    )
}

async function writeNormal(text: string) {
    await writeToTerminal(
        OutputType.NORMAL,
        text,
        false,
        SYMBOLS[7],
        100
    )
}


export const writeNewLevel = async (level: number) => {
    const currentLevelContent = get(staticContent).levels.find(l => l.level === level)
    let text: string[] = []
    if (currentLevelContent.short_content_start && currentLevelContent.short_content_start.content) {
        text = extractTexts(currentLevelContent.short_content_start)
    }

    await write("********************")
    await write(`Order #${level}`)

    for (let i = 0; i < text.length; i++) {
        await typeWrite(text[i])
    }

    await write("Production goals:")
    const currentGoals = get(playerGoals)
    for (let i = 0; i < currentGoals.length; i++) {
        await writeNormal(`${currentGoals[i].materialType === MaterialType.NONE ? "Energy" : MaterialType[currentGoals[i].materialType]}: ${currentGoals[i].amount}`)
    }
    if (level === 1) {
        await write("********************")
        await writeAction("TYPE HELP TO GET STARTED")
    }
    await write("********************")
}