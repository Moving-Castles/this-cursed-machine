import type { Command } from "@components/Main/Terminal/types";

import { blink } from "@components/Main/Terminal/commands/blink";
import { help } from "@components/Main/Terminal/commands/help";
import { build } from "@components/Main/Terminal/commands/build";
import { connect } from "@components/Main/Terminal/commands/connect";
import { disconnect } from "@components/Main/Terminal/commands/disconnect";
import { destroy } from "@components/Main/Terminal/commands/destroy";
import { start } from "@components/Main/Terminal/commands/start";
import { attachDepot } from "@components/Main/Terminal/commands/attachDepot";
import { detachDepot } from "@components/Main/Terminal/commands/detachDepot";
import { emptyDepot } from "@components/Main/Terminal/commands/emptyDepot";
import { ship } from "@components/Main/Terminal/commands/ship";
// Testing
import { buy } from "@components/Main/Terminal/commands/buy";
import { skip } from "@components/Main/Terminal/commands/skip";
import { graduate } from "@components/Main/Terminal/commands/graduate";
import { resolve } from "@components/Main/Terminal/commands/resolve";
import { fail } from "@components/Main/Terminal/commands/fail";

export const commands: Command[] = [
    build,
    destroy,
    connect,
    disconnect,
    attachDepot,
    detachDepot,
    emptyDepot,
    ship,
    help,
    blink,
    // Testing
    resolve,
    skip,
    start,
    fail,
    buy,
    graduate
]