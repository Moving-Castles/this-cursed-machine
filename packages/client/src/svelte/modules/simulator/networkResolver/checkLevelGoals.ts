import { get } from "svelte/store"
import { playerGoals } from "../../state"
import { MaterialType } from "../../state/enums"
import { simulatedPlayerEnergy, boxOutput } from ".."

/**
 * Checks if all player level goals have been met.
 * @returns {boolean} - Returns `true` if all level goals are achieved, otherwise returns `false`.
 */
export function checkLevelGoals(): boolean {

    console.log('checking level goals')

    // export const playerGoals = derived(
    //     [playerBox, goals],
    //     ([$playerBox, $goals]) => {
    //       return Object.values($goals).filter(g => g?.level === $playerBox.level)
    //     }
    //   )

    let currentGoals = get(playerGoals)

    console.log('currentGoals', currentGoals)

    if (currentGoals.length === 0) return false

    const achieved = currentGoals.map(goal => {

        console.log('goal', goal)

        // MaterialType.NONE => energy check
        if (goal.materialType === MaterialType.NONE) {
            console.log('energy check')
            return get(simulatedPlayerEnergy) >= goal.amount
        }

        const pooledMaterialAmount = get(boxOutput)[goal.materialType]

        console.log('pooledMaterialAmount', pooledMaterialAmount)
        console.log('pooledMaterialAmount && pooledMaterialAmount >= goal.amount', pooledMaterialAmount && pooledMaterialAmount >= goal.amount)

        // Do we have the required amount of the material?
        return pooledMaterialAmount && pooledMaterialAmount >= goal.amount
    })

    return achieved.every(v => v === true)
}