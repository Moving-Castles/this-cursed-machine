import { get } from "svelte/store"
import { playerGoals } from "../../state"
import { MaterialType } from "../../state/enums"
import { simulatedPlayerEnergy, boxOutput } from ".."

/**
 * Checks if all player level goals have been met.
 * @returns {boolean} - Returns `true` if all level goals are achieved, otherwise returns `false`.
 */
export function checkLevelGoals(): boolean {

    if (get(playerGoals).length === 0) return false

    const achieved = get(playerGoals).map(goal => {

        // MaterialType.NONE => energy check
        if (goal.materialType === MaterialType.NONE) {
            return get(simulatedPlayerEnergy) >= goal.amount
        }

        const pooledMaterialAmount = get(boxOutput)[goal.materialType]

        // Do we have the required amount of the material?
        return pooledMaterialAmount && pooledMaterialAmount >= goal.amount
    })

    return achieved.every(v => v === true)
}