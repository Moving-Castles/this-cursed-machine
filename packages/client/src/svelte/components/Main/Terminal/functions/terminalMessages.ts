import { get } from "svelte/store"
import { tutorialProgress } from "@modules/ui/assistant"
import { TERMINAL_OUTPUT_TYPE } from "../enums"
import { typeWriteToTerminal } from "./writeToTerminal"
import { SYMBOLS } from "../index"
import { clearTerminalOutput } from "./helpers"

async function orderFulfilled() {
  clearTerminalOutput()

  await typeWriteToTerminal(
    TERMINAL_OUTPUT_TYPE.SUCCESS,
    "ORDER FULFILLED",
    SYMBOLS[7],
    10,
    800
  )
}

async function startUp() {
  const lvl = get(tutorialProgress)
  // console.log(lvl)
  if (lvl === 1) {
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.NORMAL,
      "Stump securely locked in pod",
      SYMBOLS[7],
      10,
      800
    )
  } else {
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.NORMAL,
      "Stump securely locked in pod",
      SYMBOLS[7],
      10,
      800
    )
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.ALERT,
      "Type help",
      SYMBOLS[7],
      10,
      800
    )
  }
}

export const terminalMessages = {
  startUp,
  orderFulfilled,
}
