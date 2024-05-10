import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import {
    loadingLineMuted,
    loadingSpinnerMuted,
    writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import {
    waitForCompletion,
    waitForTransaction,
} from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound"
import { fillTank } from "@modules/action"
import { parseError } from "@components/Main/Terminal/functions/errors"

async function execute(tankEntity: string, amount: number, materialId: MaterialId) {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Depositing material in tank...")
        // ...
        const action = fillTank(tankEntity, amount, materialId)
        // ...
        await waitForTransaction(action, loadingSpinnerMuted)
        // ...
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "In progress...")
        await waitForCompletion(action, loadingLineMuted)
        // playSound("tcm", "TRX_yes")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")
        // ...
        // playSound("tcm", "bugs")
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

export const depositTokens: Command<[tankEntity: string, amount: number, materialId: MaterialId]> = {
    id: COMMAND.DEPOSIT_TOKENS,
    public: true,
    name: "deposit",
    alias: "+",
    objectTerm: "tokens",
    fn: execute,
}
