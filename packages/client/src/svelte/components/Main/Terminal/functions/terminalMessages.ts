import { get } from "svelte/store"
import { tutorialProgress } from "@modules/ui/assistant"
import { TERMINAL_OUTPUT_TYPE } from "../enums"
import { typeWriteToTerminal } from "./writeToTerminal"
import { SYMBOLS } from "../index"
import { clearTerminalOutput } from "./helpers"

async function orderFullfilled() {
  clearTerminalOutput()

  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    "ORDER FULLFILLED",
    SYMBOLS[7],
    10,
    800
  )
  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    "PERFORMANCE: ADEQUATE",
    SYMBOLS[7],
    10,
    800
  )

  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    "BUG VAT HAS BEEN REPLENISHED",
    SYMBOLS[7],
    10,
    800
  )
}

async function startUp() {
  const lvl = get(tutorialProgress)
  console.log(lvl)
  if (lvl === 0) {
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.SPECIAL,
      "Starting employment competence assessment",
      SYMBOLS[7],
      10,
      800
    )
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.SPECIAL,
      "Type blink",
      SYMBOLS[7],
      10,
      800
    )
  } else {
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.SPECIAL,
      "Stump securely locked in pod",
      SYMBOLS[7],
      10,
      800
    )
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.SPECIAL,
      "Type help",
      SYMBOLS[7],
      10,
      800
    )
  }
}

export const terminalMessages = {
  startUp,
  orderFullfilled,
}
