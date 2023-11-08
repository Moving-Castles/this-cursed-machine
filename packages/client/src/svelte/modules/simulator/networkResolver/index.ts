import { get } from "svelte/store"
import { localResolved, patches } from ".."
import { blockNumber } from "../../network"
import { playerBox, playerCore } from "../../state"
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
 * @see {@link playerCore} For the state of the player.
 * @see {@link playerBox} For the last resolved state on-chain.
 * @see {@link localResolved} For the local resolution state.
 * @see {@link patches} For applying patches or updates to the state.
 */
export async function initStateSimulator() {
  const unsubscribe = blockNumber.subscribe(async blockNumber => {
    const playerCoreValue = get(playerCore)
    const playerBoxValue = get(playerBox)
    const localResolvedValue = get(localResolved)
    const lastCompletedBlockValue = get(lastCompletedBlock)
    const showLevelValue = get(showLevelModal)

    // Player is not spawned yet
    if (!playerCoreValue) return

    // Play heartbeat on new block if player is in pod
    if (playerCoreValue.carriedBy && get(UIState) === UI.READY) {
      playSound("tcm", "singleHeartbeat100")
    }

    // Network was resolved onchain
    if (playerBoxValue.lastResolved !== localResolvedValue) {
      // Resolve output
      patches.set(resolve(playerCoreValue.carriedBy))
      // Update localResolved
      localResolved.set(playerBoxValue.lastResolved)
    }

    // !hack: Wait to allow the changes to propagate
    await new Promise(r => setTimeout(r, 100))

    // Check if level goals have been reached
    // @hack: Wait 10 blocks from last completion to avoid duplicate modals bug
    if (
      checkLevelGoals(playerCoreValue.level) &&
      showLevelValue === false &&
      blockNumber > lastCompletedBlockValue + 10
    ) {
      console.log(
        "level, ",
        playerCoreValue.level,
        " reached at block nr. ",
        blockNumber
      )
      showLevelModal.set(true)
    }
  })

  return unsubscribe
}
