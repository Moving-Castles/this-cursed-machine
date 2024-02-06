import type { Command } from "../types";

import { blink } from "./blink";
import { clear } from "./clear";
import { help } from "./help";
import { build } from "./build";
import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { destroy } from "./destroy";
import { inspect } from "./inspect";
import { resolve } from "./resolve";
import { map } from "./map";
import { order } from "./order";
import { skip } from "./skip";
import { start } from "./start";
import { fail } from "./fail";
import { connectStorage } from "./connectStorage";
import { disconnectStorage } from "./disconnectStorage";
import { clearStorage } from "./clearStorage";
import { fill } from "./fill";

export const commands: Command[] = [
    build,
    destroy,
    connect,
    disconnect,
    inspect,
    order,
    map,
    blink,
    clear,
    help,
    resolve,
    skip,
    start,
    fail,
    connectStorage,
    disconnectStorage,
    clearStorage,
    fill
]