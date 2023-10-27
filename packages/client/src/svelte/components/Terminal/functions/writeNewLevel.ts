import { typeWriteToTerminal } from "./writeToTerminal"
import { OutputType } from "../types"
import { SYMBOLS } from ".."
import { get } from "svelte/store"
import { playerGoals } from "../../../modules/state"
import { MaterialType } from "../../../modules/state/enums"
import { staticContent } from "../../../modules/content"
import { extractTexts } from "../../../modules/content/sanity"

async function writeNarrative(text: string) {
    await typeWriteToTerminal(
        OutputType.SPECIAL,
        text,
        SYMBOLS[7],
        10,
        100
    )
}

export const writeNewLevel = async (level: number) => {
    const currentLevelContent = get(staticContent).levels.find(l => l.level === level)
    let text = []
    if (currentLevelContent.short_content_start && currentLevelContent.short_content_start.content) {
        text = extractTexts(currentLevelContent.short_content_start)
    }

    await writeNarrative("********************")
    await writeNarrative(`Order #${level}`)

    for (let i = 0; i < text.length; i++) {
        await writeNarrative(text[i])
    }

    await writeNarrative("Production goals:")
    const currentGoals = get(playerGoals)
    for (let i = 0; i < currentGoals.length; i++) {
        await writeNarrative(`${currentGoals[i].materialType === MaterialType.NONE ? "Energy" : MaterialType[currentGoals[i].materialType]}: ${currentGoals[i].amount}`)
    }
    await writeNarrative("********************")
}