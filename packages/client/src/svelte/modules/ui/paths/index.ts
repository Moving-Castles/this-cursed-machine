import { get, writable, derived } from "svelte/store"
import {
  entities,
  hoverDestination,
  playerBox,
  connections,
  // untraversables,
} from "../../state"
import { aStarPath, sameCoordinate, withinBounds } from "../../utils/space"

/**
 * Function that generates a SVG path string from an array of coordinates.
 * @param {Coord[]} coords - An array of coordinate objects. Each object should have 'x' and 'y' properties.
 * @return {string} A string representation of the SVG path.
 */
export const makeSvgPath = (coords: Coord[], offset: number) => {
  // Initialize an empty string to hold the SVG path.
  let string = ""

  const canAfford = (i: number) => true // free
  const makePart = (i: number) => {
    const totalPaths = get(paths)?.length
    let offsetX = offset * 10 - (totalPaths / 2) * 10
    let offsetY = offset * 10 - (totalPaths / 2) * 10
    // If it's the first coordinate, it is where the path starts.
    // We use 'M' (move to) followed by the coordinate to define the start point of the path.
    // We add 0.5 to center the path in the middle of the coordinate grid cell.
    if (i === 0) {
      string += `M${coords[i].x * 100 + 50 + offsetX} ${
        coords[i].y * 100 + 50 + offsetY
      }`
    } else {
      // For all other coordinates, we use 'L' (line to) followed by the coordinate to define a line from the current point to this coordinate.
      // We add 0.5 to center the path in the middle of the coordinate grid cell.
      string += `L${coords[i].x * 100 + 50 + offsetX} ${
        coords[i].y * 100 + 50 + offsetY
      }`
    }
  }

  // Check if the array of coordinates is not empty.
  if (coords.length > 0) {
    for (let i = 0; i < coords.length; i++) {
      makePart(i)
    }
  }
  // Return the SVG path string.
  return string
}

/**
 * Make a polyline path for coordinates.
 * Considers the start entity position and rotation of ports
 *
 * @param coords
 * @param offset
 * @param startEntity
 * @param endEntity
 * @param sourcePort
 * @param targetPort
 * @returns
 */
export const makePolyline = (
  coords: Coord[],
  offset: number,
  startEntity?: Entity,
  endEntity?: Entity,
  sourcePort?: Port,
  targetPort?: Port
) => {
  let string = ""
  let length = 20
  let unit = 100

  const makePart = (i: number) => {
    const totalPaths = get(paths)?.length
    let offsetX = offset * 10 - (totalPaths / 2) * 10
    let offsetY = offset * 10 - (totalPaths / 2) * 10
    if (i === 0) {
      if (startEntity && sourcePort) {
        const totalRotation = portTotalRotation(sourcePort, startEntity)
        const offsetMapping = {
          0: { x: 0, y: -1 },
          1: { x: 1, y: 0 },
          2: { x: 0, y: 1 },
          3: { x: -1, y: 0 },
        }
        offsetX = offsetMapping[totalRotation].x * 40
        offsetY = offsetMapping[totalRotation].y * 40
      }
      string += `${coords[i].x * unit + unit / 2 + offsetX},${
        coords[i].y * unit + unit / 2 + offsetY
      } `
    } else if (i < coords.length) {
      if (i !== coords.length - 1 && coords.length > 3) {
        // HACKY: cut one coord
        string += `${coords[i].x * unit + unit / 2 + offsetX},${
          coords[i].y * unit + unit / 2 + offsetY
        } `
      }
    } else {
      if (endEntity && targetPort) {
        const totalRotation = portTotalRotation(targetPort, endEntity)
        const offsetMapping = {
          0: { x: 0, y: -1 },
          1: { x: 1, y: 0 },
          2: { x: 0, y: 1 },
          3: { x: -1, y: 0 },
        }
        offsetX = offsetMapping[totalRotation].x * 40
        offsetY = offsetMapping[totalRotation].y * 40
      }
      string += `${coords[coords.length - 1].x * unit + unit / 2 + offsetX},${
        coords[coords.length - 1].y * unit + unit / 2 + offsetY
      } `
    }
  }

  if (coords.length > 0) {
    for (let i = 0; i < length; i++) {
      makePart(i)
    }
  }

  return string
}

/**
 * The user's selection of ports. Is set in UI / Events module
 */
export const portSelection = writable([])

/**
 * Get the total rotation of the port
 * @param port Port
 * @param entity Entity
 * @returns total rotation
 */
export const portTotalRotation = (port: Port, entity: Entity) => {
  // Port direction is port side corrected by rotation
  const portDirection = port.portPlacement || 0
  const entityRotation = entity.rotation || 0
  const totalRotation = (portDirection + entityRotation) % 4

  return totalRotation
}

/**
 * Port corrected coordinates
 * @param coord
 * @param port
 * @param entity
 * @returns
 */
export const portCorrectedCoordinate = (
  coord: Coord,
  port: Port,
  entity: Entity
) => {
  const rotationMapping = {
    0: { x: 0, y: -1 },
    1: { x: 1, y: 0 },
    2: { x: 0, y: 1 },
    3: { x: -1, y: 0 },
  }
  const totalRotation = portTotalRotation(port, entity)

  // Get the next coordinate in the correct direction
  return {
    x: coord.x + rotationMapping[totalRotation].x,
    y: coord.y + rotationMapping[totalRotation].y,
  }
}

/**
 * Exceptions for pathfinding (so the lines wrap around)
 */
export const pathfindingExceptions = writable([] as Coord[])

/**
 * Planned path
 */
export const plannedPath = derived(
  [
    portSelection,
    entities,
    hoverDestination,
    pathfindingExceptions,
    playerBox,
    // untraversables,
  ],
  ([
    $portSelection,
    $entities,
    $hoverDestination,
    $pathfindingExceptions,
    $playerBox,
  ]) => {
    const ignore = [
      ...Object.values($entities)
        .filter(ent => ent.position)
        .map(({ position }) => position),
      // ...$untraversables,
    ]
    // .filter(a => !$pathfindingExceptions.some(b => sameCoordinate(b, a))) // remove the exceptionsas Coord[]

    // We only want to plan a path when the port selection is 1.
    if ($portSelection.length === 1) {
      const port = $entities[$portSelection[0]]
      const entity = $entities[port?.carriedBy]

      const startCoord = portCorrectedCoordinate(
        entity.position,
        port as Port,
        entity
      )
      let endCoord = $hoverDestination
      const endEntity = Object.entries($entities)
        .filter(([address, ent]) => !!ent.position)
        .find(([address, ent]) =>
          sameCoordinate($hoverDestination, ent.position)
        )
      let targetPort: Boolean | Port = false

      if (endEntity) {
        const [address, e] = endEntity
        // Figure out if the end entity has ports
        const ports = Object.values($entities).filter(
          ent => ent.carriedBy === address
        )
        let endPorts = []
        if (ports.length > 1) {
          endPorts = [...ports].filter(p => p.portType !== port.portType)
        } else {
          endPorts = [...ports]
        }
        targetPort = endPorts[0] as Port
        endCoord = portCorrectedCoordinate(e.position, targetPort, e)
      }

      if (
        withinBounds(startCoord, $playerBox.width, $playerBox.height) &&
        withinBounds(endCoord, $playerBox.width, $playerBox.height)
      ) {
        return {
          startEntity: entity,
          sourcePort: port,
          endEntity: endEntity ? endEntity[1] : false,
          targetPort,
          coords: [
            entity.position,
            ...aStarPath(startCoord, endCoord, ignore),
            endEntity ? endEntity[1].position : null,
          ].filter(coord => !!coord),
        }
      }
    }

    return { coords: [] }
  }
)

/**
 * Paths that are path-found
 */
export const paths = derived(
  [connections, entities, plannedPath],
  ([$connections, $entities, $plannedPath]) => [
    ...Object.values($connections).map(conn => {
      const sourcePort = $entities[conn?.sourcePort] as Port
      const targetPort = $entities[conn?.targetPort] as Port
      let ignore = [
        ...Object.values($entities)
          .filter(ent => ent.position)
          .map(({ position }) => position),
        // ...$untraversables,
      ] as Coord[]

      if (
        sourcePort &&
        targetPort &&
        sourcePort.carriedBy &&
        targetPort.carriedBy
      ) {
        const startEntity = $entities[sourcePort.carriedBy]
        const endEntity = $entities[targetPort.carriedBy]

        if (startEntity?.position && endEntity?.position) {
          const coords = [
            startEntity.position,
            ...aStarPath(
              portCorrectedCoordinate(
                startEntity.position,
                sourcePort,
                startEntity
              ),
              portCorrectedCoordinate(
                endEntity.position,
                targetPort,
                endEntity
              ),
              ignore
            ),
            endEntity.position,
          ]

          // Consider start and end paths
          return {
            startEntity,
            endEntity,
            sourcePort,
            targetPort,
            coords,
          }
        }
      }

      return { coords: [] }
    }),
    $plannedPath,
  ]
)
