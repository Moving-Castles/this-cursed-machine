import { derived, writable } from 'svelte/store'
import { blockNumber } from '../../network'
import { playerPod } from '../base/stores'

/**
 * Block on which the network was last resolved locally.
 * Used to check against the on-chain lastResolved value.
 */
export const localResolved = writable(BigInt(0))

/**
 * Current block number - lastResolved
 */
export const blocksSinceLastResolution = derived(
    [blockNumber, playerPod],
    ([$blockNumber, $playerPod]) => {
        return $blockNumber - ($playerPod.lastResolved ?? BigInt(0))
    }
)