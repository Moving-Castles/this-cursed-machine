import { get } from "svelte/store"
import { patches } from "./patches/stores"
import { localResolved } from "./stores"
import { blockNumber } from "@modules/network"
import {
  playerPod,
  player,
  machines,
  inlets,
  outlet,
  tanks,
  recipes
} from "../base/stores"
import { playSound } from "@modules/sound"
import { resolve } from "./resolve"
import { UIState } from "@modules/ui/stores"
import { UI } from "@modules/ui/enums"
import { tutorialProgress } from "@modules/ui/assistant"
import { networkIsRunning } from "@modules/state/simulated/stores"
import { resolve as sendResolve } from "@modules/action"

/**
 * Initializes the state simulator by subscribing to block number changes.
 * @notice The function subscribes to changes in the block number. When a block number change is detected, the function checks the state of the player and the network's resolution. If the player has been spawned and there's a discrepancy between the last on-chain resolution and the local resolution, the function resolves the output and updates the local resolution.
 */
export async function initStateSimulator() {
  blockNumber.subscribe(async _ => {

    const playerEntityValue = get(player)
    const playerPodValue = get(playerPod)
    const localResolvedValue = get(localResolved)
    // const lastCompletedBlockValue = get(lastCompletedBlock)

    // Player is not spawned yet
    if (!playerEntityValue) return

    // Play heartbeat on new block if player is in pod
    if (playerEntityValue.carriedBy && get(UIState) === UI.READY && get(tutorialProgress) > 0) {
      playSound("tcm", "singleHeartbeat100")
    }

    // Network was resolved onchain
    if (playerPodValue.lastResolved !== localResolvedValue) {
      console.log('%c ******************* ', "background: #effb04; color: #000")
      console.log('%c **** RESOLVING **** ', "background: #effb04; color: #000")
      console.log('%c ******************* ', "background: #effb04; color: #000")

      // Resolve locally
      patches.set(resolve(get(machines), get(inlets), get(outlet), get(tanks), get(recipes)))

      // Update localResolved
      localResolved.set(playerPodValue.lastResolved)
    }
  })


  // Check if the network is running
  networkIsRunning.subscribe(async isRunning => {
    if (!isRunning) {
      console.log('%c ********************** ', "background: #effb04; color: #000")
      console.log('%c **** NETWORK STOP **** ', "background: #effb04; color: #000")
      console.log('%c ********************** ', "background: #effb04; color: #000")

      // Force resolve on chain
      sendResolve()
    }
  })
}
