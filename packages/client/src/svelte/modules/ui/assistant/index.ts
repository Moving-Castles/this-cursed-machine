import type { Writable } from "svelte/store"
import type { Action } from "@modules/action/actionSequencer"
import { MACHINE_TYPE } from "contracts/enums"
import { writable, derived, get } from "svelte/store"
import { playerId, playerPod } from "@modules/state/base/stores"
import {
  shippableDepots,
  simulatedMachines,
} from "@modules/state/simulated/stores"

import { storableNumber } from "@modules/utils/storable"
import { staticContent } from "@modules/content"

export type Step = {
  type: "wait" | "tab" | "contract" | "command" | "order" | "read" | "custom"
  value: number[] | Record<string, string | string[]>
}

export const tutorialProgress = storableNumber(0, "tutorialProgress")
export const tutorialCompleted = writable([])
export const currentCondition: Writable<Step | null> = writable(null)

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
  const DEPOT_ADDRESSES = get(playerPod)?.depotsInPod
  const BUG_DEPOT = get(playerPod)?.depotsInPod?.[0]

  const DRYER_ADDRESS = MACHINES?.find(
    ([_, machine]) => machine.machineType === MACHINE_TYPE.DRYER
  )?.[0]

  const ADVANCE_CONDITIONS = [
    { type: "wait", value: 5000 },
    { type: "command", value: ["blink", "."] }, // 1
    { type: "command", value: ["blink", "."] }, // 2
    { type: "tab", value: [1] }, // 3
    { type: "command", value: ["blink", "."] }, // 4
    { type: "contract", value: { systemId: "accept" } }, // 5
    { type: "tab", value: [0] }, // 6
    { type: "contract", value: { systemId: "buy" } }, // 7
    {
      type: "contract",
      value: { systemId: "attachDepot", params: [BUG_DEPOT, INLET_ADDRESSES] },
    }, // 8
    { type: "contract", value: { systemId: "connect" } }, // 9
    {
      type: "contract",
      value: { systemId: "connect", params: [PLAYER_ADDRESS, OUTLET_ADDRESS] },
    }, // 10
    {
      type: "contract",
      value: {
        systemId: "attachDepot",
        params: [DEPOT_ADDRESSES, OUTLET_ADDRESS],
      },
    }, // 11
    { type: "order" }, // 12
    { type: "contract", value: { systemId: "ship" } }, // 13
    { type: "tab", value: [1] }, // 14
    { type: "contract", value: { systemId: "accept" } }, // 15
    { type: "contract", value: { systemId: "buy" } }, // 16
    {
      type: "contract",
      value: { systemId: "attachDepot", params: [BUG_DEPOT, INLET_ADDRESSES] },
    }, // 17
    {
      type: "contract",
      value: { systemId: "connect", params: [PLAYER_ADDRESS] },
    }, // 18
    {
      type: "contract",
      value: { systemId: "build", params: [MACHINE_TYPE.DRYER] },
    }, // 19
    {
      type: "contract",
      value: { systemId: "connect", params: [PLAYER_ADDRESS] },
    }, // 20
    {
      type: "contract",
      value: {
        systemId: "attachDepot",
        params: [DEPOT_ADDRESSES, OUTLET_ADDRESS],
      },
    }, // 21
    { type: "order" }, // 22
    { type: "contract", value: { systemId: "ship" } }, // 23
    { type: "tab", value: [1] }, // 24
    { type: "contract", value: { systemId: "accept" } }, // 25
    { type: "tab", value: [2] }, // 26
    { type: "read" }, // 27
    { type: "order" }, // 28
    { type: "contract", value: { systemId: "ship" } }, // 29
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
  let value = get(tutorialCompleted)

  if (value.includes(lvl)) return

  value = [...value, lvl]
  tutorialCompleted.set(value)
  tutorialProgress.set(lvl + 1)
  if (nextCondition) currentCondition.set(nextCondition)
  updateConditions()
}

/** Check input against the current condition */
export function advanceTutorial(
  input: number | string | Action | null,
  level: number,
  type: "tab" | "contract" | "command" | "order" | "read" | "wait" | "custom"
) {
  const $advanceConditions = get(advanceConditions)

  const step = $advanceConditions[level]

  if (step) {
    // Check if condition is met or not
    if (
      step.type === "command" &&
      type === "command" &&
      typeof input === "string"
    ) {
      if (step.value.includes(input.toLowerCase())) {
        markComplete(level)
      }
    }

    if (step.type === "tab" && type === "tab") {
      if (step.value.includes(Number(input))) {
        markComplete(level)
      }
    }

    if (step.type === "contract" && type === "contract") {
      console.log(step.value.systemId, input.systemId)
      // Check the systemId
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

      markComplete(level)
    }

    // Read message ?
    if (step.type === "read" && type === "read") {
      markComplete(level)
    }

    if (step.type === "custom" && type === "custom" && step.value === input) {
      markComplete(level)
    }

    if (step.type === "wait" && type === "wait") {
      markComplete(level)
    }

    // Ready to ship ?
    if (step.type === "order" && type === "order") {
      if (Object.values(get(shippableDepots)).some(e => e === true)) {
        markComplete(level)
      }
    }
  }
}
