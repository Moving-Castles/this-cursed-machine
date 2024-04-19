import type { Command } from "@components/Main/Terminal/types"
import { get } from "svelte/store"
import { COMMAND, TERMINAL_OUTPUT_TYPE } from "@components/Main/Terminal/enums"
import { parseError } from "@components/Main/Terminal/functions/errors"
import {
  unplugTank as sendUnplugTank,
  shipTank as sendShipTank,
  wipePod as sendWipePod,
} from "@modules/action"
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
import { playSound } from "@modules/sound"
import { terminalMessages } from "../functions/terminalMessages"
import {
  simulatedTanks,
  shippableTanks,
} from "@modules/state/simulated/stores"
import { EMPTY_CONNECTION } from "@modules/utils/constants"

async function execute(tankEntity: string) {
  try {
    const $player = get(player)
    const tanks = get(simulatedTanks)
    const $shippableTanks = get(shippableTanks)

    const canShip = $shippableTanks[tankEntity]

    if (!canShip)
      writeToTerminal(TERMINAL_OUTPUT_TYPE.ERROR, "Not ready to ship")

    if (!tanks[tankEntity] || !canShip) return

    // If the tank is connected, detach it before shipping
    if (tanks[tankEntity].tankConnection !== EMPTY_CONNECTION) {
      writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Locating tank...")
      const detachAction = sendUnplugTank(tankEntity)
      await waitForTransaction(detachAction, loadingSpinner)
      writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Detachment in progress...")
      await waitForCompletion(detachAction, loadingLine)
      await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Tank detached")
      playSound("tcm", "selectionEsc2")
    }

    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Shipping material...")
    const action = sendShipTank(tankEntity)
    await waitForTransaction(action, loadingSpinner)
    writeToTerminal(TERMINAL_OUTPUT_TYPE.NORMAL, "Fulfilment in progress...")

    await waitForCompletion(action, loadingLine)
    playSound("tcm", "TRX_yes")

    await writeToTerminal(TERMINAL_OUTPUT_TYPE.SUCCESS, "Done")

    // If the player is in the tutorial and ships, wipe the pod
    if ($player.tutorial) {
      const anotherAction = sendWipePod()
      await waitForTransaction(anotherAction, loadingSpinner)
    }

    playSound("tcm", "playerLvlend")
    await terminalMessages.orderFulfilled()

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

export const shipTank: Command<[tankEntity: string]> = {
  id: COMMAND.SHIP_TANK,
  public: true,
  name: "ship",
  alias: "s",
  objectTerm: "tank",
  fn: execute,
}
