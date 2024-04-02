import type { Command } from "@components/Main/Terminal/types"
import { get } from "svelte/store"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { parseError } from "@components/Main/Terminal/functions/errors"
import {
  detachDepot as sendDetachDepot,
  ship as sendShip,
} from "@modules/action"
import { shippableDepots } from "@modules/state/simulated/stores"
import {
  loadingLine,
  loadingSpinner,
  writeToTerminal,
} from "@components/Main/Terminal/functions/writeToTerminal"
import {
  waitForCompletion,
  waitForTransaction,
} from "@modules/action/actionSequencer/utils"
import { player } from "@modules/state/base/stores"
import { tutorialProgress } from "@modules/ui/assistant"
import { playSound } from "@modules/sound"
import { terminalMessages } from "../functions/terminalMessages"
import {
  simulatedDepots,
  shippableDepots,
} from "@modules/state/simulated/stores"
import { EMPTY_CONNECTION } from "@modules/utils/constants"

async function execute(depotEntity: string) {
  try {
    const $player = get(player)
    const depots = get(simulatedDepots)
    const $shippableDepots = get(shippableDepots)

    const canShip = $shippableDepots[depotEntity]

    if (!canShip)
      writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Not ready to ship")

    if (!depots[depotEntity] || !canShip) return

    // If the depot is connected, detach it before shipping
    if (depots[depotEntity].depotConnection !== EMPTY_CONNECTION) {
      writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Locating depot...")
      const detachAction = sendDetachDepot(depotEntity)
      await waitForTransaction(detachAction, loadingSpinner)
      writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Detachment in progress...")
      await waitForCompletion(detachAction, loadingLine)
      await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Depot detached")
      playSound("tcm", "selectionEsc2")
    }

    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Shipping material...")
    const action = sendShip(depotEntity)
    await waitForTransaction(action, loadingSpinner)
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Fullfillment in progress...")

    await waitForCompletion(action, loadingLine)
    playSound("tcm", "TRX_yes")

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")

    playSound("tcm", "playerLvlend")

    await terminalMessages.orderFullfilled()

    // If the player is in the tutorial and ships, do an extra check to make sure if their tutorial level should be skipped ahead
    if ($player.tutorial) {
      const $tutorialProgress = get(tutorialProgress)

      // Compare with goals
    }

    return
  } catch (error) {
    console.error(error)
    playSound("tcm", "TRX_no")
    await writeToTerminal(
      TERMINAL_OUTPUT_TYPE.ERROR,
      parseError(error as string)
    )
    return
  }
}

export const ship: Command<[depotEntity: string]> = {
  id: COMMAND.SHIP,
  public: true,
  name: "ship",
  alias: "s",
  description: "Ship order",
  fn: execute,
}
