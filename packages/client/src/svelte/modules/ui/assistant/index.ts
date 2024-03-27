import { writable, derived } from "svelte/store"
import { storableNumber } from "@modules/utils/storable"
import { staticContent } from "@modules/content"

export const tutorialProgress = storableNumber(0)

export const currentMessage = derived(
  [tutorialProgress, staticContent],
  ([$tutorialProgress, $staticContent]) => {
    console.log($staticContent.tutorial.steps[$tutorialProgress])
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
  console.log("clearing")
  assistantMessages.set([])
}
