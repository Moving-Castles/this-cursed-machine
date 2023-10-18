import type { Command } from "../types";

import { blink } from "./blink";
import { clear } from "./clear";
import { help } from "./help";
import { build } from "./build";
import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { destroy } from "./destroy";
import { inspect } from "./inspect";
import { transfer } from "./transfer";
import { resolve } from "./resolve";

export const commands: Command[] = [
    build,
    destroy,
    connect,
    disconnect,
    inspect,
    blink,
    clear,
    help,
    resolve,
    transfer,
]