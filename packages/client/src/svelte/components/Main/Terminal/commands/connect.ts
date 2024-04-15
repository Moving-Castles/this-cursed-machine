import type { Command } from "@components/Main/Terminal/types";
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums";
import { connect as sendConnect } from "@modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "@modules/action/actionSequencer/utils"
import { playSound } from "@modules/sound";
import { PORT_INDEX } from "@modules/state/base/enums";

async function execute(sourceMachine: string, targetMachine: string, portIndex: PORT_INDEX) {
    try {
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Allocating pipe...")
        // ...
        const action = sendConnect(sourceMachine, targetMachine, portIndex)
        // ...
        await waitForTransaction(action, loadingSpinner)
        // ...
        writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Connection in progress...")
        await waitForCompletion(action, loadingLine)
        playSound("tcm", "TRX_yes")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")
        // ...
        return;
    } catch (error) {
        console.error(error)
        playSound("tcm", "TRX_no")
        await writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Command failed")
        return
    }
}

export const connect: Command<[sourceMachine: string, targetMachine: string, portIndex: PORT_INDEX]> = {
    id: COMMAND.CONNECT,
    public: true,
    name: "connect",
    alias: "c",
    objectTerm: "machine",
    fn: execute,
}