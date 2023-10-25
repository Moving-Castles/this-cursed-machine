import { tick } from "svelte"
import { terminalOutput, SYMBOLS } from ".."
import { OutputType, type Output } from "../types"
import { scrollToEnd } from "./helpers"
import { playSound } from "../../../modules/sound"

/**
 * Writes a given string to the terminal output. Optionally replaces the previous output.
 * @param {OutputType} type - The type of output to be written to the terminal.
 * @param {string} str - The string to be written to the terminal.
 * @param {boolean} [replace=false] - Whether to replace the previous output. Defaults to false.
 * @returns {Promise<void>} - A promise indicating the completion of the write operation.
 */
export async function writeToTerminal(type: OutputType, str: string, replace: boolean = false, symbol: string = SYMBOLS[2], delay: number = 10): Promise<void> {

    // Write to terminal output
    terminalOutput.update(output => {
        let newOutput: Output =
        {
            text: str,
            symbol: symbol,
            type: type
        }

        if (replace) {
            output[output.length - 1] = newOutput
        } else {
            output.push(newOutput)
        }
        return output
    })


    // Delay
    if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay))

    scrollToEnd()
    return
}

export async function typeWriteToTerminal(type: OutputType, str: string, symbol: string = SYMBOLS[2], delay: number = 10, endDelay: number = 10): Promise<void> {

    await writeToTerminal(type, str[0], false, symbol, delay)
    for (let i = 1; i < str.length; i++) {
        playSound("tcm", "cant");
        await writeToTerminal(type, str.substring(0, i + 1), true, symbol, delay)
    }

    // Delay
    if (endDelay > 0) await new Promise(resolve => setTimeout(resolve, endDelay))

    scrollToEnd()
    return
}