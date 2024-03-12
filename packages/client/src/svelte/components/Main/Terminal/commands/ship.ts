import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { ship as sendShip } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";
// import OrderFullfilled from "@components/Main/Popovers/OrderFullfilled.svelte";
// import { renderComponent } from "@components/Main/Popovers/";
import { terminalMessages } from "../functions/terminalMessages";

async function execute(depotEntity: string) {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Shipping material...")
        // ...
        const action = sendShip(depotEntity)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Fullfillment in progress...")

        await waitForCompletion(action, loadingLine)
        playSound("tcm", "TRX_yes")

        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")

        // ...
        playSound("tcm", "playerLvlend");

        // renderComponent(document.body, OrderFullfilled)

        await terminalMessages.orderFullfilled()

        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
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