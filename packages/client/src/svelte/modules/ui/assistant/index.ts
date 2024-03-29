import type { Action } from "@modules/action/actionSequencer"
import { MACHINE_TYPE } from "contracts/enums"
import { writable, derived, get } from "svelte/store"
import { playerId, playerPod } from "@modules/state/base/stores"
import { shippableDepots } from "@modules/state/simulated/stores"

import { storableNumber } from "@modules/utils/storable"
import { staticContent } from "@modules/content"

export const tutorialProgress = storableNumber(0, "storable")

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

export function advanceTutorial(
  input: number | string | Action,
  level: number,
  type: "tab" | "contract" | "command" | "order" | "read" | "custom"
) {
  // const PLAYER_ADDRESS = get(playerAddress)
  const PLAYER_ADDRESS = get(playerId)
  const OUTLET_ADDRESS = get(playerPod)?.fixedEntities?.outlet
  const BUG_DEPOT = get(playerPod)?.depotsInPod?.[0]
  const INLET_ADDRESSES = get(playerPod)?.fixedEntities?.inlets
  const DEPOT_ADDRESSES = get(playerPod)?.depotsInPod

  const ADVANCE_CONDITIONS = [
    { type: "command", value: ["blink", "."] }, // 0
    { type: "tab", value: [1] }, // 1
    { type: "contract", value: { systemId: "accept" } }, // 2
    { type: "tab", value: [0] }, // 3
    {
      type: "contract",
      value: { systemId: "connect", params: [PLAYER_ADDRESS, OUTLET_ADDRESS] },
    }, // 4
    { type: "order" }, // 5
    { type: "contract", value: { systemId: "ship" } }, // 6
    { type: "tab", value: [1] }, // 7
    { type: "contract", value: { systemId: "accept" } }, // 8
    { type: "tab", value: [2] }, // 9
    { type: "contract", value: { systemId: "buy" } }, // 10
    { type: "tab", value: [0] }, // 11
    {
      type: "contract",
      value: { systemId: "build", params: [MACHINE_TYPE.DRYER] },
    }, // 12
    { type: "order" }, // 13
    { type: "contract", value: { systemId: "ship" } }, // 14
    { type: "tab", value: [1] }, // 15
    { type: "contract", value: { systemId: "accept" } }, // 16
    { type: "contract", value: { systemId: "buy" } }, // 17
    { type: "tab", value: [3] }, // 18
    { type: "read" }, // 19
    { type: "tab", value: [0] }, // 20
    {
      type: "contract",
      value: { systemId: "attachDepot", params: [BUG_DEPOT, INLET_ADDRESSES] },
    }, // 21
    {
      type: "contract",
      value: {
        systemId: "attachDepot",
        params: [DEPOT_ADDRESSES, OUTLET_ADDRESS],
      },
    }, // 22
    { type: "order" }, // 23
    { type: "contract", value: { systemId: "ship" } }, // 23
    { type: "tab", value: [2] }, // 24
    { type: "contract", value: { systemId: "name" } }, // 25
    { type: "tab", value: [4] }, // 26
    { type: "custom", value: "message" }, // 26
  ]

  // Indeces correspond to steps
  level = Number(level)

  const step = ADVANCE_CONDITIONS[level]

  if (step) {
    // Check if condition is met or not
    if (
      step.type === "command" &&
      type === "command" &&
      typeof input === "string"
    ) {
      if (step.value.includes(input.toLowerCase())) {
        return tutorialProgress.set(level + 1)
      }
    }

    if (step.type === "tab" && type === "tab") {
      if (step.value.includes(Number(input))) {
        return tutorialProgress.set(level + 1)
      }
    }

    if (step.type === "contract" && type === "contract") {
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

      return tutorialProgress.set(level + 1)
    }

    // Ready to ship ?
    if (step.type === "order" && type === "order") {
      if (Object.values(get(shippableDepots)).some(e => e === true)) {
        return tutorialProgress.set(level + 1)
      }
    }

    // Read message ?
    if (step.type === "read" && type === "read") {
      return tutorialProgress.set(level + 1)
    }

    if (step.type === "custom" && type === "custom" && step.value === input) {
      return tutorialProgress.set(level + 1)
    }
  }
}
