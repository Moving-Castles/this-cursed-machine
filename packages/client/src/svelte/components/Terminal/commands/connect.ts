import type { Command } from "../types";
import { COMMAND, OutputType } from "../types";
import { connect as sendConnect } from "../../../modules/action";
import { loadingLine, loadingSpinner, writeToTerminal } from "../functions/writeToTerminal";
import { waitForCompletion, waitForTransaction } from "../functions/helpers";
import { playSound } from "../../../modules/sound";
import { PortIndex } from "../../../modules/state/enums";

async function execute(sourceMachine: string, targetMachine: string, portIndex: PortIndex) {
    writeToTerminal(OutputType.NORMAL, "Allocating pipe...")
    // ...
    const action = sendConnect(sourceMachine, targetMachine, portIndex)
    // ...
    await waitForTransaction(action, loadingSpinner)
    // ...
    writeToTerminal(OutputType.NORMAL, "Connection in progress...")
    await waitForCompletion(action, loadingLine)
    playSound("tcm", "TRX_yes")
    await writeToTerminal(OutputType.SUCCESS, "Done")
    // ...
    return;
}

export const connect: Command<[sourceMachine: string, targetMachine: string, portIndex: PortIndex]> = {
    id: COMMAND.CONNECT,
    public: true,
    name: "connect",
    alias: "c",
    description: "Connect machines",
    fn: execute,
}