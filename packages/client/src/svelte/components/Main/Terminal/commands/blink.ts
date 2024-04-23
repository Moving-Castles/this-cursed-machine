import { flashEffect } from "@components/Main/Terminal/functions/helpers"
import type { Command } from "@components/Main/Terminal/types"
import { COMMAND, TERMINAL_TYPE } from "@components/Main/Terminal/enums"
import { playSound } from "@modules/sound"

async function execute(_: TERMINAL_TYPE) {
  playSound("tcm", "blink")
  await flashEffect()
  console.log("done")
  return
}

export const blink: Command<[terminalType: TERMINAL_TYPE]> = {
  id: COMMAND.BLINK,
  public: true,
  name: "blink",
  alias: ".",
  fn: execute,
}
