import type { Action } from "@modules/action/actionSequencer"
import { MACHINE_TYPE } from "contracts/enums"
import { writable, derived, get } from "svelte/store"
import {
  playerAddress,
  playerPod,
  shippableDepots,
} from "@modules/state/base/stores"
import { storableNumber } from "@modules/utils/storable"
import { staticContent } from "@modules/content"

export const tutorialProgress = storableNumber(0)

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

// The actions are one of:
// Go to tab
// Succesful contract function
// Input command
// Depot at value
//
export function advanceTutorial(
  input: number | string | Action,
  level: number,
  type: "tab" | "contract" | "command" | "order" | "read"
) {
  const PLAYER_ADDRESS = get(playerAddress)
  const OUTLET_ADDRESS = get(playerPod)?.fixedEntities?.outlet
  const BUG_DEPOT = get(playerPod)?.depotsInPod?.[0]
  const INLET_ADDRESSES = get(playerPod)?.fixedEntities?.inlets
  const DEPOT_ADDRESSES = get(playerPod)?.depotsInPod

  // const DEPOT_ADDRESS = get(playerPod)?.fixedEntities

  const ADVANCE_CONDITIONS = [
    { type: "command", value: ["blink", "."] },
    { type: "tab", value: [2] },
    { type: "contract", value: { systemId: "accept" } },
    { type: "tab", value: [0] },
    {
      type: "contract",
      value: { systemId: "connect", params: [PLAYER_ADDRESS, OUTLET_ADDRESS] },
    },
    { type: "order" },
    { type: "contract", value: { systemId: "ship" } },
    { type: "tab", value: [2] },
    { type: "contract", value: { systemId: "accept" } },
    { type: "tab", value: [3] },
    { type: "contract", value: { systemId: "buy" } },
    { type: "tab", value: [0] },
    {
      type: "contract",
      value: { systemId: "build", params: [MACHINE_TYPE.DRYER] },
    },
    { type: "order" },
    { type: "contract", value: { systemId: "ship" } },
    { type: "tab", value: [2] },
    { type: "contract", value: { systemId: "accept" } },
    { type: "contract", value: { systemId: "buy" } },
    { type: "tab", value: [1] },
    { type: "read" }, // new one
    { type: "tab", value: [0] },
    {
      type: "contract",
      value: { systemId: "attachDepot", params: [BUG_DEPOT, INLET_ADDRESSES] },
    },
    {
      type: "contract",
      value: {
        systemId: "attachDepot",
        params: [DEPOT_ADDRESSES, INLET_ADDRESSES],
      },
    },
    { type: "order" },
    { type: "tab", value: [3] },
    { type: "contract", value: { systemId: "name" } },
    { type: "tab", value: [4] },
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
        step.value.params.forEach(prm => {
          if (Array.isArray(prm)) {
            if (prm.filter(value => input.params.includes(value))?.length === 0)
              return
          } else {
            if (!input.params.includes(prm)) return
          }
        })
      }

      return tutorialProgress.set(level + 1)
    }

    // Just checking if the current order is ready to be shipped
    // Since only one material at a time, it is enough to check if we have any shippableDepot
    if (step.type === "order" && type === "order") {
      if (Object.values(get(shippableDepots)).some(e => e === true)) {
        return tutorialProgress.set(level + 1)
      }
    }

    if (step.type === "read" && type === "read") {
      return tutorialProgress.set(level + 1)
    }
  }
}
