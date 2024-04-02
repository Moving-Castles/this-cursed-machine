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
}

async function startUp() {
  const lvl = get(tutorialProgress)
  if (lvl === 0) {
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.NORMAL,
      "Employment competence assessment required",
      SYMBOLS[7],
      10,
      800
    )
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.NORMAL,
      "TCM AI Assistant will guide you through the process",
      SYMBOLS[7],
      10,
      800
    )
    await typeWriteToTerminal(
      TERMINAL_OUTPUT_TYPE.ALERT,
      "Type blink to start",
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
  orderFullfilled,
}
