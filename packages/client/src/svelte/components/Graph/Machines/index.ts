import { EntityType } from "../../../modules/state/enums"

export function data(
  simulatedMachines: Entity[],
  simulatedConnections: Entity[],
  simulatedPorts: Entity[]
) {
  return {
    nodes: [
      ...Object.entries(simulatedMachines).map(([key, entry]) => ({
        id: `Machine-${key}`,
        entry,
        group: EntityType.MACHINE,
      })),
    ],
    links: [
      // Connect ports to each other
      ...Object.entries(simulatedConnections)
        .map(([key, entry]) => ({
          id: key,
          entry,
        }))
        .map(({ id, entry }) => {
          // Connect the source machine to the target machine
          const sP = simulatedPorts[entry.sourcePort]
          const tP = simulatedPorts[entry.targetPort]

          if (sP && tP) {
            return {
              id,
              entry,
              group: EntityType.CONNECTION,
              source: `Machine-${sP.carriedBy}`,
              target: `Machine-${tP.carriedBy}`,
            }
          }
          return false
        })
        .filter(thing => thing), // check if they are all valid links
    ],
  }
}
