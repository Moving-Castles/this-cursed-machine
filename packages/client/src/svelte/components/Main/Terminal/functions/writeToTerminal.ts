import { SYMBOLS } from "@components/Main/Terminal/"
import { terminalOutput } from "@components/Main/Terminal/stores"
import type { Output } from "@components/Main/Terminal/types"
import { TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"

import { scrollToEnd } from "@components/Main/Terminal/functions/helpers"
import { playSound, randomPitch } from "@modules/sound"

/**
 * Writes a given string to the terminal output. Optionally replaces the previous output.
 * @param {TERMINAL_OUTPUT_TYPE} type - The type of output to be written to the terminal.
 * @param {string} str - The string to be written to the terminal.
 * @param {boolean} [replace=false] - Whether to replace the previous output. Defaults to false.
 * @returns {Promise<void>} - A promise indicating the completion of the write operation.
 */
export async function writeToTerminal(
  type: TERMINAL_OUTPUT_TYPE,
  str: string,
  replace: boolean = false,
  symbol: string = SYMBOLS[2],
  delay: number = 10
): Promise<void> {
  // Write to terminal output
  terminalOutput.update(output => {
    let newOutput: Output = {
      text: str,
      symbol: symbol,
      type: type,
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

/**
 * Types characters one by one to the terminal with a given delay.
 *
 * @async
 * @function
 * @param {TERMINAL_OUTPUT_TYPE} type - The type of output.
 * @param {string} str - The string to be typed out.
 * @param {string} [symbol=SYMBOLS[2]] - The symbol used to represent typing progress.
 * @param {number} [delay=10] - The delay (in milliseconds) between typing each character.
 * @param {number} [endDelay=10] - The delay (in milliseconds) after the entire string is typed.
 * @returns {Promise<void>} A promise that resolves when typing is complete.
 */
export async function typeWriteToTerminal(
  type: TERMINAL_OUTPUT_TYPE,
  str: string,
  symbol: string = SYMBOLS[2],
  delay: number = 10,
  endDelay: number = 10
): Promise<void> {
  await writeToTerminal(type, str[0], false, symbol, delay)
  for (let i = 1; i < str.length; i++) {
    playSound("tcm", "typingCant", false, false, randomPitch())
    await writeToTerminal(type, str.substring(0, i + 1), true, symbol, delay)
  }

  // Delay
  if (endDelay > 0) await new Promise(resolve => setTimeout(resolve, endDelay))

  scrollToEnd()
  return
}

/**
 * Display a loading line with increasing character count.
 * @param {number} index - The number of characters to display.
 * @returns {Promise<void>} A promise that resolves when the loading line has been written to the terminal.
 */
export async function loadingLine(index: number): Promise<void> {
  const CHARACTER = "·"
  playSound("tcm", "TRX_wait_b")
  if (index === 1) {
    await writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, CHARACTER, false, SYMBOLS[2], 0)
  } else {
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.NORMAL,
      CHARACTER.repeat(index),
      true,
      SYMBOLS[2],
      0
    )
  }
}

/**
 * Display a spinner using cycling glyphs to indicate loading.
 * @param {number} index - The linearly increasing index for the spinner animation.
 * @returns {Promise<void>} A promise that resolves when the spinner glyph has been written to the terminal.
 */
export async function loadingSpinner(index: number): Promise<void> {
  const GLYPHS = ["/", "–", "\\", "|"]
  const currentGlyph = GLYPHS[index % GLYPHS.length]
  playSound("tcm", "TRX_wait_b_07")
  if (index === 1) {
    await writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, currentGlyph, false, SYMBOLS[2], 0)
  } else {
    await writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, currentGlyph, true, SYMBOLS[2], 0)
  }
}
