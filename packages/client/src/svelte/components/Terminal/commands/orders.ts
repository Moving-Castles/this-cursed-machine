import type { Command } from "../types";
import { COMMAND } from "../types";
import { writeToTerminal } from "../functions/writeToTerminal";
import { OutputType } from "../types"
import { get } from "svelte/store";
import { MaterialType } from "../../../modules/state/enums";
import { SYMBOLS } from "..";
import { playerGoals, playerBox } from "../../../modules/state";

async function execute() {
    await writeToTerminal(OutputType.SPECIAL, `Order ${get(playerBox).level}:`, false, SYMBOLS[9], 100)
    // Output goals
    const goalTypes = get(playerGoals).map(goal => {
        return MaterialType[goal?.materialType] === "NONE"
            ? "ENERGY"
            : MaterialType[goal?.materialType]
    })
    for (let i = 0; i < goalTypes.length; i++) {
        await writeToTerminal(OutputType.SPECIAL, `${goalTypes[i]}: ${get(playerGoals)[i].amount}`, false, SYMBOLS[9], 100)
    }
    return;
}

export const orders: Command<[machineEntiy: string]> = {
    id: COMMAND.ORDERS,
    public: true,
    name: "orders",
    alias: "o",
    description: "Currrent orders",
    fn: execute,
}