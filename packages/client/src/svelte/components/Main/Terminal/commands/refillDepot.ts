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
import { buy as sendRefillDepot } from "@modules/action"

async function execute(offerEntity: string) {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Filling tank...")
        // ...
        const action = sendRefillDepot(offerEntity)
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
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
        return
    }
}

export const refillDepot: Command<[offerEntity: string]> =
{
    id: COMMAND.REFILL_DEPOT,
    public: true,
    name: "refill",
    alias: "r",
    objectTerm: "tank",
    fn: execute,
}
