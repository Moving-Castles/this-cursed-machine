import type { Command } from "../types";
import { COMMAND } from "../types";
import { writeLevel } from "../functions/writeLevel";
import { get } from "svelte/store";
import { player } from "../../../../modules/state/base/stores";

async function execute() {
    await writeLevel(get(player).level, true)
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