// import type { Command } from "@components/Main/Terminal/types"
// import { writeToTerminal } from "@components/Main/Terminal/functions/writeToTerminal"
// import { commands } from "@components/Main/Terminal/commands"
// import { SYMBOLS } from "@components/Main/Terminal/"
import {
  // TERMINAL_OUTPUT_TYPE,
  TERMINAL_TYPE,
  COMMAND,
} from "@components/Main/Terminal/enums"
// import { levelCommandFilter } from "@components/Main/Terminal/functions/helpers"
// import { tutorialProgress } from "@modules/ui/assistant"
// import { get } from "svelte/store"
import { showMaterialIndex } from "@modules/ui/stores"
import { playSound } from "@modules/sound"

async function execute(_: TERMINAL_TYPE) {
  showMaterialIndex.set(true)

  return
}

export const materials: Command<[terminalType: TERMINAL_TYPE]> = {
  id: COMMAND.MATERIALS,
  public: true,
  name: "materials",
  alias: "m",
  fn: execute,
}
