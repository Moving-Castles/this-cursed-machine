import type { Writable } from "svelte/store"
import type { Action } from "@modules/action/actionSequencer"
import { MACHINE_TYPE } from "contracts/enums"
import { writable, derived, get } from "svelte/store"
import { playerId, playerPod } from "@modules/state/base/stores"
import {
  shippableTanks,
  simulatedMachines,
} from "@modules/state/simulated/stores"

import { storableNumber, storableArray } from "@modules/utils/storable"
import { staticContent } from "@modules/content"

export type Step = {
  index: number
  type: "wait" | "tab" | "contract" | "command" | "order" | "read" | "custom"
  value: number[] | Record<string, string | string[]>
  skip?: number
}

export const tutorialProgress = storableNumber(0, "tutorialProgress")
export const tutorialCompleted = writable([])
export const currentCondition: Writable<Step | null> = writable(null)
export const completedSteps: Writable<number[]> = storableArray(
  [],
  "completedSteps"
)

export const advanceConditions: Writable<Step[]> = writable([])

export const currentMessage = derived(
  [tutorialProgress, staticContent],
  ([$tutorialProgress, $staticContent]) => {
    return $staticContent.tutorial.steps[$tutorialProgress]
  }
)
export interface AssistantMessage {
  message: HTMLElement | string
  timestamp: DOMHighResTimeStamp
  disappear?: boolean
}

export const assistantMessages = writable([] as AssistantMessage[])

/** Send a tutorial message */
export function sendMessage(
  message: string,
  options?: { disappear?: boolean }
) {
  const messageInstance: AssistantMessage = {
    message,
    timestamp: performance.now(),
    disappear: options?.disappear || false,
  }
  assistantMessages.set([messageInstance]) // replace another message if it exists
}

export function clearMessage() {
  assistantMessages.set([])
}

function updateConditions() {
  const MACHINES = Object.entries(get(simulatedMachines))
  const PLAYER_ADDRESS = get(playerId)
  const OUTLET_ADDRESS = get(playerPod)?.fixedEntities?.outlet
  const INLET_ADDRESSES = get(playerPod)?.fixedEntities?.inlets
  const TANK_ADDRESSES = get(playerPod)?.tanksInPod
  const BUG_TANK = get(playerPod)?.tanksInPod?.[0]

  // Defined in each step are the other steps you are allowed to skip to.
  // Sequential steps will have no skip value, and steps that can be done in another order will have the max skip step index defined. Skips are only looking forward
  const ADVANCE_CONDITIONS = [
    // IN SEQUENCE
    { index: 0, type: "wait", value: 8000 },
    { index: 1, type: "command", value: ["blink", "."] },
    { index: 2, type: "command", value: ["blink", "."] },
    { index: 3, type: "tab", value: [1] },
    { index: 4, type: "command", value: ["blink", "."] },
    { index: 5, type: "contract", value: { systemId: "acceptOrder" } },
    { index: 6, type: "tab", value: [0] },
    { index: 7, type: "contract", value: { systemId: "buyOffer" } },
    {
      index: 8,
      type: "contract",
      value: {
        systemId: "plugTank",
        params: [BUG_TANK, INLET_ADDRESSES],
      },
    },
    { index: 9, type: "contract", value: { systemId: "connect" } },
    {
      index: 10,
      type: "contract",
      value: {
        systemId: "connect",
        params: [PLAYER_ADDRESS, OUTLET_ADDRESS],
      },
    },
    {
      index: 11,
      type: "contract",
      value: {
        systemId: "plugTank",
        params: [TANK_ADDRESSES, OUTLET_ADDRESS],
      },
    }, // 11
    { index: 12, type: "order" }, // 12
    // IN SEQUENCE
    { index: 13, type: "contract", value: { systemId: "shipTank" } }, // 13
    { index: 14, type: "tab", value: [1] }, // 14
    // MIXED ORDER 15 - 22
    {
      index: 15,
      type: "contract",
      value: { systemId: "acceptOrder" },
    }, // 15
    { index: 16, type: "contract", value: { systemId: "buyOffer" }, skip: 19 }, // 16
    {
      index: 17,
      type: "contract",
      value: { systemId: "plugTank", params: [BUG_TANK, INLET_ADDRESSES] },
      skip: 19,
    }, // 17
    {
      index: 18,
      type: "contract",
      value: { systemId: "connect", params: [PLAYER_ADDRESS] },
    }, // 18
    {
      index: 19,
      type: "contract",
      value: { systemId: "buildMachine", params: [MACHINE_TYPE.DRYER] },
    }, // 19
    {
      index: 20,
      type: "contract",
      value: { systemId: "connect", params: [PLAYER_ADDRESS] },
    }, // 20
    {
      index: 21,
      type: "contract",
      value: {
        systemId: "plugTank",
        params: [TANK_ADDRESSES, OUTLET_ADDRESS],
      },
    }, // 21
    { index: 22, type: "order" }, // 22
    // IN SEQUENCE
    { index: 23, type: "contract", value: { systemId: "shipTank" } }, // 23
    { index: 24, type: "tab", value: [1] }, // 24
    { index: 25, type: "contract", value: { systemId: "acceptOrder" } }, // 25
    { index: 26, type: "tab", value: [2] }, // 26
    { index: 27, type: "read" }, // 27
    { index: 28, type: "order" }, // 28
    { index: 29, type: "contract", value: { systemId: "shipTank" } }, // 29
    { index: 30, type: "tab", value: [3] }, // 30
  ]

  advanceConditions.set(ADVANCE_CONDITIONS)

  return ADVANCE_CONDITIONS
}

/** Initialize tutorial and populate stores */
export function initTutorial() {
  const ADVANCE_CONDITIONS = updateConditions()

  currentCondition.set(ADVANCE_CONDITIONS[0])
}

/** Mark step as complete and update stores */
const markComplete = (lvl: number) => {
  const $advanceConditions = get(advanceConditions)
  const nextCondition = $advanceConditions[lvl + 1]
  const value = get(tutorialCompleted)

  if (value.includes(lvl)) return

  const newValue = [...value, lvl]
  tutorialCompleted.set(newValue)
  tutorialProgress.set(lvl + 1)
  if (nextCondition) currentCondition.set(nextCondition)
  updateConditions()
}

/** Skip to the next order if user ships preemptively.
 * We don't want to be rude now... It happens
 */
export function checkSkipNextOrder() {
  // Find the next type index with order
  const currentStepIndex = get(tutorialProgress)
  const $advanceConditions = get(advanceConditions)

  const currentStep = $advanceConditions[currentStepIndex]

  if (currentStep.value?.systemId !== "shipTank") {
    for (let i = currentStepIndex; i < $advanceConditions.length; i++) {
      if ($advanceConditions[i]?.value?.systemId === "shipTank") {
        markComplete($advanceConditions[i]?.index)
        return false
      }
    }
  }

  return false
}

/** Check input against the current condition */
export function advanceTutorial(
  input: number | string | Action | null,
  level: number,
  type: "tab" | "contract" | "command" | "order" | "read" | "wait" | "custom"
) {
  const $advanceConditions = get(advanceConditions)
  const currentStep = $advanceConditions[level]

  if (currentStep) {
    let otherSteps = []

    if (currentStep.skip) {
      for (let i = level; i < currentStep.skip; i++) {
        otherSteps.push($advanceConditions[i])
      }
    }

    const allStepsToCheck = [currentStep, ...otherSteps]

    allStepsToCheck.forEach(step => {
      // Ready to ship ?
      if (step.type === "order" && type === "order") {
        if (Object.values(get(shippableTanks)).some(e => e === true)) {
          if (step.type === "order") {
            markComplete(step.index)
          }
        }
      }

      // Check if condition is met or not
      if (
        step.type === "command" &&
        type === "command" &&
        typeof input === "string"
      ) {
        if (step.value.includes(input.toLowerCase())) {
          markComplete(step.index)
        }
      }

      if (step.type === "tab" && type === "tab") {
        if (step.value.includes(Number(input))) {
          markComplete(step.index)
        }
      }

      if (step.type === "contract" && type === "contract") {
        if (step.value.systemId !== input.systemId) return

        // Check if all the params correspond to all the input params
        if (step.value.params) {
          let satisfies = true

          step.value.params.forEach(prm => {
            const all = step.value.params.flat()

            if (Array.isArray(prm)) {
              input.params.forEach(address => {
                if (!all.includes(address)) {
                  satisfies = false
                }
              })
            } else {
              if (!input.params.includes(prm)) satisfies = false
            }
          })

          if (!satisfies) return
        }

        markComplete(step.index)
      }

      // Read message ?
      if (step.type === "read" && type === "read") {
        markComplete(step.index)
      }

      if (step.type === "custom" && type === "custom" && step.value === input) {
        markComplete(step.index)
      }

      if (step.type === "wait" && type === "wait") {
        markComplete(step.index)
      }
    })
  }
}
