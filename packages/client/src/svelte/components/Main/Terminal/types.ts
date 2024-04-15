import { MACHINE_TYPE } from "@modules/state/base/enums";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";

export type Command<T extends any[] = any[]> = {
    id: COMMAND;
    public: boolean;
    name: string;
    alias: string; // Shortcut
    objectTerm?: string; // What the command acts on. Used for help command
    fn: (...args: T) => Promise<void>;
}

export type Output = {
    type: TERMINAL_OUTPUT_TYPE;
    text: string;
    symbol: string;
}

export type SelectOption = {
    label: string
    value: string | MACHINE_TYPE | null
}