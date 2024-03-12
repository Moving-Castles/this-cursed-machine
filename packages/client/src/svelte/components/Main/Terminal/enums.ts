export enum TERMINAL_TYPE {
    FULL,
    SPAWN,
    NAMING
}

export enum DIRECTION {
    OUTGOING,
    INCOMING
}

export enum TERMINAL_OUTPUT_TYPE {
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
    ORDER,
    SKIP,
    START,
    COMPLETE,
    FAIL,
    ATTACH_DEPOT,
    DETACH_DEPOT,
    EMPTY_DEPOT,
    FILL,
    ACCEPT,
    BUY,
    GRADUATE
}