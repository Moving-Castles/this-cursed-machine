import type { Command } from "../types";
import { COMMAND } from "../types";
import { writeLevel } from "../functions/writeLevel";
import { get } from "svelte/store";
import { playerCore } from "../../../modules/state";

async function execute() {
    await writeLevel(get(playerCore).level, true)
    return
}

export const order: Command = {
    id: COMMAND.ORDER,
    public: true,
    name: "order",
    alias: "o",
    description: "Currrent order",
    fn: execute,
}