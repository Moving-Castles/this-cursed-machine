import { get } from "svelte/store";
import type { Command } from "@components/Main/Terminal/types";
import { COMMAND } from "@components/Main/Terminal/types";
import { writeLevel } from "@components/Main/Terminal/functions/writeLevel";
import { player } from "@modules/state/base/stores";

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