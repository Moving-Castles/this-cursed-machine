import { get } from "svelte/store"
import { localResolved, patches } from ".."
import { blockNumber } from "../../network"
import { playerPod, playerEntity } from "../../state"
import { playSound } from "../../sound"
import { resolve } from "./resolve"
import { checkLevelGoals } from "./checkLevelGoals"
import { pulseGraph } from "../../ui/transitions"
import {
  UIState,
  UI,
  showLevelModal,
  lastCompletedBlock,
} from "../../ui/stores"

/**
 * Initializes the state simulator by subscribing to block number changes.
 *
 * @notice The function subscribes to changes in the block number. When a block number change is detected, the function checks the state of the player and the network's resolution. If the player has been spawned and there's a discrepancy between the last on-chain resolution and the local resolution, the function resolves the output and updates the local resolution.
 * @see {@link blockNumber} For the observable representing block number changes.
 * @see {@link playerEntity} For the state of the player.
 * @see {@link playerPod} For the last resolved state on-chain.
 * @see {@link localResolved} For the local resolution state.
 * @see {@link patches} For applying patches or updates to the state.
 */
export async function initStateSimulator() {
  blockNumber.subscribe(async blockNumber => {
    const playerEntityValue = get(playerEntity)
    const playerPodValue = get(playerPod)
    const localResolvedValue = get(localResolved)
    const lastCompletedBlockValue = get(lastCompletedBlock)
    const showLevelValue = get(showLevelModal)

    // Player is not spawned yet
    if (!playerEntityValue) return

    // Play heartbeat on new block if player is in pod
    if (playerEntityValue.carriedBy && get(UIState) === UI.READY) {
      playSound("tcm", "singleHeartbeat100")
      pulseGraph()
    }

    // Network was resolved onchain
    if (playerPodValue.lastResolved !== localResolvedValue) {
      // Resolve output
      patches.set(resolve(playerEntityValue.carriedBy))
      // Update localResolved
      localResolved.set(playerPodValue.lastResolved)
    }

    // !hack: Wait to allow the changes to propagate
    await new Promise(r => setTimeout(r, 100))

    // Check if level goals have been reached
    // @hack: Wait 10 blocks from last completion to avoid duplicate modals bug
    if (
      checkLevelGoals(playerEntityValue.level) &&
      showLevelValue === false &&
      blockNumber > lastCompletedBlockValue + 10
    ) {
      showLevelModal.set(true)
    }
  })
}
