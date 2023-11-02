import { MachineType } from "../../modules/state/enums";

export enum TerminalType {
    FULL,
    SPAWN
}

export enum OutputType {
    ERROR,
    COMMAND,
    NORMAL,
    SUCCESS,
    HELP,
    SPECIAL,
    SPECIALINV,
    INFO
}

export enum COMMAND {
    BLINK,
    CLEAR,
    HELP,
    BUILD,
    DESTROY,
    CONNECT,
    DISCONNECT,
    INSPECT,
    RESOLVE,
    TRANSFER,
    MAP,
    GOALS,
    SKIP,
    RESTART
}

export type Command<T extends any[] = any[]> = {
    id: COMMAND;
    public: boolean;
    name: string;
    alias: string;
    description: string;
    fn: (...args: T) => Promise<void>;
}

export type Output = {
    type: OutputType;
    text: string;
    symbol: string;
}

export type SelectOption = {
    label: string
    value: string | MachineType | null
}