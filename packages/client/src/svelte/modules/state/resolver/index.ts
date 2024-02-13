import { get } from "svelte/store"
import { patches } from "./patches/stores"
import { localResolved } from "./stores"
import { blockNumber } from "../../network"
import {
  playerPod,
  player,
  machines,
  inlets,
  outlet,
  depots,
  recipes
} from "../base/stores"
import { playSound } from "../../sound"
import { resolve } from "./resolve"
import { pulseGraph } from "../../ui/transitions"
import { UIState } from "../../ui/stores"
import { UI } from "../../ui/enums"

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

    // console.log('blocknumber', blockNumber)

    // Player is not spawned yet
    if (!playerEntityValue) return

    // Play heartbeat on new block if player is in pod
    if (playerEntityValue.carriedBy && get(UIState) === UI.READY) {
      playSound("tcm", "singleHeartbeat100")
      pulseGraph()
    }

    // Network was resolved onchain
    if (playerPodValue.lastResolved !== localResolvedValue) {
      console.log('%c ******************* ', "background: #effb04; color: #000")
      console.log('%c **** RESOLVING **** ', "background: #effb04; color: #000")
      console.log('%c ******************* ', "background: #effb04; color: #000")

      // Resolve locally
      patches.set(resolve(get(machines), get(inlets), get(outlet), get(depots), get(recipes)))

      // Update localResolved
      localResolved.set(playerPodValue.lastResolved)
    }
  })
}
