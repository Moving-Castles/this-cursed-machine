import { MACHINE_TYPE, PORT_INDEX } from "@modules/state/base/enums"
import type { SelectOption } from "@components/Main/Terminal/types"
import type { Writable } from "svelte/store"
import { staticContent } from "@modules/content"
import { player } from "@modules/state/base/stores"
import { discoveredMessages } from "@modules/state/simulated/stores"
import { writable, derived } from "svelte/store"
import { UI, TABS } from "./enums"
import { storableArray } from "@modules/utils/storable"
import {
  GraphConnection,
  GraphMachine,
} from "@components/Main/Tabs/Pod/Graph/types"

const permissionsDefault =
  Notification.permission === "granted" ? "granted" : ""

export const UIState = writable(UI.LOADING)
export const activeTab = writable(TABS.POD)

export const localLevel = writable(0)
export const lastCompletedBlock = writable(0)

export const inspecting: Writable<GraphConnection | GraphMachine | null> =
  writable(null)
export const viewingAttachment = writable(-1)
export const alignTooltip = writable("center") // "center" | "left" | "right" = "center"
export const mouseX = writable(0)
export const mouseY = writable(0)
export const graphScale = writable(1)
export const selectedParameters: Writable<
  (string | MACHINE_TYPE | PORT_INDEX | null)[]
> = writable([])
export const selectedOption: Writable<SelectOption | false> = writable(false)
export const graphElement: Writable<SVGElement> = writable()
export const thud = writable(false)
export const orderAcceptInProgress = writable("0x0")
export const terminalBooted = writable(false)
export const inboxRead = storableArray([], "tcm_inboxRead")
export const notificationPermissions = writable(permissionsDefault) // block or granted
export const showMaterialIndex = writable(false)
export const inboxMessages = derived(
  [player, staticContent, discoveredMessages],
  ([$player, $staticContent, $discoveredMessages]) => {
    if (!$staticContent) return []
    return $staticContent.messages.filter(msg => {
      if ($player.tutorial) {
        return $player.tutorial && msg.tutorial
      } else {
        return (
          msg.tutorial ||
          msg.graduation ||
          $discoveredMessages.includes(msg._id)
        )
      }
    })
  }
)
