import { writable, get } from "svelte/store"
import lodash from "lodash"
const { throttle } = lodash
import {
  originAddress,
  dragOrigin,
  dropDestination,
  entities,
} from "../../state"
import { showFlowChart, showGraph } from "../../ui/stores"
import { portSelection } from "../../ui/paths"
import { NULL_COORDINATE } from "../../utils/space"
import { connect } from "../../action"
import { ConnectionType } from "../../state/enums"

const img = new Image()

const placeholder = writable(img)

/**
 * Initialize UI to make dragging seamless
 */
export function initUI() {
  // Add an empty image when dragged to prevent image missing icon
  const img = new Image()

  img.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

  img.addEventListener("load", () => {
    placeholder.set(img)
  })
}

/**
 * Thin wrapper for drag events
 */
export function onDragStart(e, address: string, passive = false) {
  console.log("on drag start")
  if (!passive) {
    originAddress.set(address)
    dragOrigin.set(get(entities)[address]?.position || NULL_COORDINATE)
  }
  e.dataTransfer.setData("text/plain", e.target.classList)
  e.dataTransfer.setDragImage(img, 0, 0)
}

export function onDragOver(coordinates: Coord) {
  dropDestination.set(coordinates)
}

/**
 *
 * @param address
 * @param port
 */
export function onPortClick(address: string, port: Port) {
  const selection = get(portSelection)

  console.log(address, port)

  // Override 0 if the port type clicked is the same as the first
  if (selection.length === 1 && selection[0].portType === port.portType) {
    selection[0] = port
  } else if (selection[0] !== address) {
    selection.push(address)
  }

  portSelection.set(selection)

  // Tally the ports
  if (selection.length === 2) {
    connect(ConnectionType.RESOURCE, selection[0], selection[1])

    portSelection.set([])
  }

  console.log(get(portSelection))
}

/**
 * Key down
 * @param event MouseEvent
 */
export function onKeyDown({ key }) {
  if (key === "Escape") {
    portSelection.set([])
    showFlowChart.set(false)
    showGraph.set(false)
  }
}

export const onWheel = (node: HTMLElement, { step = 15 } = {}) => {
  node.style.overflow = "hidden"
  const handler = throttle(e => {
    console.log(e)
    e.preventDefault()
    const pos = node.scrollTop
    const nextPos = pos + step * -Math.sign(e.deltaY)
    node.scrollTop = nextPos
  }, 40)

  node.addEventListener("wheel", handler)

  return {
    destroy() {
      node.removeEventListener("wheel", handler)
    },
  }
}
