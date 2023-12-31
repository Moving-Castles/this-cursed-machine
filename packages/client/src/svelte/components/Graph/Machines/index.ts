import { EntityType } from "../../../modules/state/enums"
import type { Connection } from "../../../modules/simulator/types"

export const MACHINE_SIZE = 80

export function data(
  simulatedMachines: Entity[],
  simulatedConnections: Connection[]
) {
  return {
    nodes: [
      ...Object.entries(simulatedMachines).map(([key, entry]) => ({
        id: `Machine-${key}`,
        address: key,
        entry,
        group: EntityType.MACHINE,
      })),
    ],
    links: simulatedConnections.map(entry => ({
      id: `Connection-${entry.id}`,
      address: entry.id,
      entry,
      source: `Machine-${entry.sourceMachine}`,
      target: `Machine-${entry.targetMachine}`,
      group: EntityType.CONNECTION,
    })),
  }
}

export function x1(links: any[], d) {
  const linksWithSource = links.filter(l => {
    return l.entry.sourceMachine === d.entry.sourceMachine
  })

  let OFFSET = 0

  if (linksWithSource.length > 1) {
    OFFSET = linksWithSource.map(l => l.id).indexOf(d.id)
    OFFSET = OFFSET * 25 - (linksWithSource.length * 10) / 2
  }

  return d.source.group === EntityType.PORT &&
    d.target.group === EntityType.PORT
    ? d.source.x + OFFSET
    : d.source.x + OFFSET
}

export function y1(links: any, d, d3yScale) {
  const linksWithSource = links.filter(l => {
    return l.entry.sourceMachine === d.entry.sourceMachine
  })

  let OFFSET = 0

  if (linksWithSource.length > 1) {
    OFFSET = linksWithSource.map(l => l.id).indexOf(d.id)
    OFFSET = OFFSET * 25 - (linksWithSource.length * 10) / 2
  }

  return d3yScale(
    d.source.group === EntityType.PORT && d.target.group === EntityType.PORT
      ? d.source.y + OFFSET
      : d.source.y + OFFSET
  )
}

export function x2(links: any, d) {
  const linksWithTarget = links.filter(l => {
    return l.entry.targetMachine === d.entry.targetMachine
  })

  let OFFSET = 0

  if (linksWithTarget.length > 1) {
    OFFSET = linksWithTarget.map(l => l.id).indexOf(d.id)
    OFFSET = OFFSET * 25 - (linksWithTarget.length * 10) / 2
  }

  return d?.target?.group === EntityType.MACHINE
    ? d?.target.x + OFFSET
    : d?.target.x + OFFSET
}

export function y2(links: any, d, d3yScale) {
  const linksWithTarget = links.filter(l => {
    return l.entry.targetMachine === d.entry.targetMachine
  })

  let OFFSET = 0

  if (linksWithTarget.length > 1) {
    OFFSET = linksWithTarget.map(l => l.id).indexOf(d.id)
    OFFSET = OFFSET * 25 - (linksWithTarget.length * 10) / 2
  }

  return d3yScale(
    d?.target.group === EntityType.MACHINE
      ? d?.target.y + OFFSET
      : d?.target.y + OFFSET
  )
}
