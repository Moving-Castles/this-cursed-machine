import type { Command } from "../types";
import { COMMAND } from "../types";

async function execute() {
    return;
}

export const blink: Command<[]> = {
    id: COMMAND.BLINK,
    public: true,
    name: "blink",
    alias: "-",
    description: "...",
    fn: execute,
}