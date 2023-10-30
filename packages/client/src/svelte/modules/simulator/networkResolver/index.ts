import { get } from "svelte/store"
import { localResolved, patches } from ".."
import { blockNumber } from "../../network"
import { playerBox, playerCore } from "../../state"
import { playSound } from "../../sound"
import { resolve } from "./resolve"
import { checkLevelGoals } from "./checkLevelGoals"
import {
  showLevelModal,
  lastCompletedBlock,
  cursorCharacter,
} from "../../ui/stores"

/**
 * Initializes the state simulator by subscribing to block number changes.
 *
 * @notice The function subscribes to changes in the block number. When a block number change is detected, the function checks the state of the player and the network's resolution. If the player has been spawned and there's a discrepancy between the last on-chain resolution and the local resolution, the function resolves the output and updates the local resolution.
 * @see {@link blockNumber} For the observable representing block number changes.
 * @see {@link playerCore} For the state of the player.
 * @see {@link playerBox} For the last resolved state on-chain.
 * @see {@link localResolved} For the local resolution state.
 * @see {@link patches} For applying patches or updates to the state.
 */
export async function initStateSimulator() {
  blockNumber.subscribe(async blockNumber => {
    // Player is not spawned yet
    if (!get(playerCore)) return

    // Play heartbeat on new block if player is in pod
    if (get(playerCore).carriedBy) {
      playSound("tcm", "singleHeartbeat")
      const c = get(cursorCharacter)
      cursorCharacter.set(c === "" ? "█" : "")
    }

    // Network was resolved onchain
    if (get(playerBox).lastResolved !== get(localResolved)) {
      // Resolve output
      patches.set(resolve(get(playerCore).carriedBy))
      // Update localResolved
      localResolved.set(get(playerBox).lastResolved)
    }

    // !hack: Wait to allow the changes to propagate
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check if level goals have been reached
    // @hack: Wait 10 blocks from last completion to avoid duplicate modals bug
    if (
      checkLevelGoals(get(playerCore).level) &&
      get(showLevelModal) === false &&
      blockNumber > get(lastCompletedBlock) + 10
    ) {
      showLevelModal.set(true)
    }
  })
}
