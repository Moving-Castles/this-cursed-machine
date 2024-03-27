import type { Command } from "@components/Main/Terminal/types";
import { get } from "svelte/store";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { parseError } from "@components/Main/Terminal/functions/errors"
import { detachDepot as sendDetachDepot, ship as sendShip } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";
import { terminalMessages } from "../functions/terminalMessages";
import { simulatedDepots } from "@modules/state/simulated/stores";
import { EMPTY_CONNECTION } from "@modules/utils/constants";

async function execute(depotEntity: string) {
    try {
        const depots = get(simulatedDepots)
        if (!depots[depotEntity]) return

        // If the depot is connected, detach it before shipping
        if (depots[depotEntity].depotConnection !== EMPTY_CONNECTION) {
            writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Locating depot...")
            const detachAction = sendDetachDepot(depotEntity)
            await waitForTransaction(detachAction, loadingSpinner)
            writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Detachment in progress...")
            await waitForCompletion(detachAction, loadingLine)
            await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Depot detached")
        }

        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Shipping material...")
        const action = sendShip(depotEntity)
        await waitForTransaction(action, loadingSpinner)
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Fullfillment in progress...")

        await waitForCompletion(action, loadingLine)
        playSound("tcm", "TRX_yes")

        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")

        playSound("tcm", "playerLvlend");

        await terminalMessages.orderFullfilled()

        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, parseError(error as string))
        return
    }
}

export const ship: Command<[depotEntity: string]> = {
    id: COMMAND.SHIP,
    public: true,
    name: "ship",
    alias: "s",
    description: "Ship order",
    fn: execute,
}