import type { Command } from "../types";

import { blink } from "./blink";
import { clear } from "./clear";
import { help } from "./help";
import { build } from "./build";
import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { destroy } from "./destroy";
import { resolve } from "./resolve";
import { map } from "./map";
import { order } from "./order";
import { skip } from "./skip";
import { start } from "./start";
import { fail } from "./fail";
import { attachDepot } from "./attachDepot";
import { detachDepot } from "./detachDepot";
import { clearDepot } from "./clearDepot";
import { fill } from "./fill";
import { accept } from "./accept";
import { buy } from "./buy";
import { graduate } from "./graduate";

export const commands: Command[] = [
    build,
    destroy,
    connect,
    disconnect,
    order,
    map,
    blink,
    clear,
    help,
    resolve,
    skip,
    start,
    fail,
    attachDepot,
    detachDepot,
    clearDepot,
    fill,
    accept,
    buy,
    graduate
]