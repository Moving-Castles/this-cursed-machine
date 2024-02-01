import { typeWriteToTerminal, writeToTerminal } from "./writeToTerminal"
import { OutputType } from "../types"
import { SYMBOLS } from ".."
import { get } from "svelte/store"
// import { playerGoals } from "../../../modules/state"
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

async function writeGoal(text: string) {
    await writeToTerminal(
        OutputType.NORMAL,
        text,
        false,
        SYMBOLS[9],
        400
    )
}


export const writeLevel = async (level: number, short: boolean = false) => {
    // // console.log("level score")
    // const currentLevelContent = get(staticContent).levels.find(l => l.level === level)
    // // const $playerEntity = get(playerEntity)

    // let text: string[] = []
    // if (currentLevelContent.short_content_start && currentLevelContent.short_content_start.content) {
    //     text = extractTexts(currentLevelContent.short_content_start)
    // }


    // if (level - 1 > 0) {
    //   const time = Number($playerEntity.completionTimes[level - 2])

    //   const par = LEVEL_PAR_TIMES[level - 1]

    //   // Calculate the percentage over PROGRESSION_PAR_TIME
    //   let percentageOverPar = 0

    //   if (time > par) {
    //     percentageOverPar =
    //       ((time - par) /
    //         par) *
    //       100
    //   }

    //   await write(`Order #${level - 1} results:`)
    //   await writeGoal(`Speed:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${time}`)
    //   await writeGoal(`Efficiency:&nbsp;&nbsp;${percentageOverPar} / ${par}`)

    // }

    await write("********************")
    await write(`Order #${level}`)


    // if (!short) {
    //     for (let i = 0; i < text.length; i++) {
    //         await typeWrite(text[i])
    //     }

    //     await write("WAREHOUSE GOALS:")
    // }

    // const currentGoals = get(playerGoals)
    // for (let i = 0; i < currentGoals.length; i++) {
    //     await writeGoal(`${MaterialType[currentGoals[i].materialType]}: ${currentGoals[i].amount}`)
    // }

    if (level === 1 && !short) {
        await write("********************")
        await writeAction("TYPE HELP TO GET STARTED")
    }

    await write("********************")
}