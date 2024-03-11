import { OutputType } from "../types";
import { typeWriteToTerminal } from "./writeToTerminal";
import { SYMBOLS } from "../index";
import { clearTerminalOutput } from "./helpers";

async function orderFullfilled() {

    clearTerminalOutput()

    await typeWriteToTerminal(
        OutputType.SUCCESS,
        "ORDER FULLFILLED",
        SYMBOLS[7],
        10,
        800,
    )
    await typeWriteToTerminal(
        OutputType.SUCCESS,
        "PERFORMANCE: ADEQUATE",
        SYMBOLS[7],
        10,
        800,
    )

    await typeWriteToTerminal(
        OutputType.SUCCESS,
        "BUG VAT HAS BEEN REPLENISHED",
        SYMBOLS[7],
        10,
        800,
    )
}

async function startUp() {
    await typeWriteToTerminal(
        OutputType.SPECIAL,
        "Stump securely locked in pod",
        SYMBOLS[7],
        10,
        800,
    )
    await typeWriteToTerminal(
        OutputType.SPECIAL,
        "Type help",
        SYMBOLS[7],
        10,
        800,
    )
}

export const terminalMessages = {
    startUp,
    orderFullfilled
}
