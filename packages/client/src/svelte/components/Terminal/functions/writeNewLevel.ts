import { typeWriteToTerminal } from "./writeToTerminal"
import { OutputType } from "../types"
import { SYMBOLS } from ".."
import { get } from "svelte/store"
import { playerGoals } from "../../../modules/state"
import { MaterialType } from "../../../modules/state/enums"

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
    await writeNarrative("********************")
    await writeNarrative(`Pod #${level}`)
    await writeNarrative("Do not destroy company property")
    await writeNarrative("Production goals:")
    const currentGoals = get(playerGoals)
    for (let i = 0; i < currentGoals.length; i++) {
        await writeNarrative(`${currentGoals[i].materialType === MaterialType.NONE ? "Energy" : MaterialType[currentGoals[i].materialType]}: ${currentGoals[i].amount}`)
    }
    await writeNarrative("********************")
}