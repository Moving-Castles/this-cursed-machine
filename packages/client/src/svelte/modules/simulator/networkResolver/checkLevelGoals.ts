import { get } from "svelte/store"
import { goals } from "../../state"
import { MaterialType } from "../../state/enums"
import { simulatedPlayerEnergy, boxOutput } from ".."

/**
 * Checks if all player level goals have been met.
 * @param level - The level to check.
 * @returns {boolean} - Returns `true` if all level goals are achieved, otherwise returns `false`.
 */
export function checkLevelGoals(level: number): boolean {

  // console.log('!!! checking level goals', level)

  let currentGoals = Object.values(get(goals)).filter(goal => goal?.level === level)

  // console.log('currentGoals', currentGoals)

  if (currentGoals.length === 0) return false

  const achieved = currentGoals.map(goal => {

    // console.log('goal', goal)

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
