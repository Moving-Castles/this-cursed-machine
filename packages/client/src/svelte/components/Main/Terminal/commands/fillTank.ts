import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import {
    loadingLine,
    loadingSpinner,
    writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import {
    waitForCompletion,
    waitForTransaction,
} from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound"
import { buyOffer as sendBuyOffer } from "@modules/action"
import { parseError } from "@components/Main/Terminal/functions/errors"

async function execute(offerEntity: string) {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Filling tank...")
        // ...
        const action = sendBuyOffer(offerEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Refill in progress...")
        await waitForCompletion(action, loadingLine)
        playSound("tcm", "TRX_yes")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")
        // ...
        return
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(
            TERMINAL_OUTPUT_TYPE.ERROR,
            parseError(error as string)
        )
        return
    }
}

export const fillTank: Command<[offerEntity: string]> =
{
    id: COMMAND.FILL_TANK,
    public: true,
    name: "fill",
    alias: "f",
    objectTerm: "tank",
    fn: execute,
}
