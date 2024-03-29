import { MACHINE_TYPE } from "contracts/enums"
import type {
  SimulatedMachines,
  Connection,
} from "@modules/state/simulated/types"
import type {
  Coordinate,
  GraphConnection,
  GraphMachine,
  GraphMachines,
  PathfindingPosition,
} from "./types"
import {
  initializeGrid,
  setWalkableAt,
  findPath,
  setCostAt,
} from "./Pathfinding"
import { GRID, PLAYER, ORFICE, MACHINE } from "./constants"
import { PLACEMENT_GROUP } from "./enums"

/*
 * Inlets are aligned to the left, centered vertically with one orfice height between them
 * Outlet is aligned to the right, centered vertically
 * Player is centered horizontally and vertically
 */
const FIXED_POSITIONS = {
  inletOne: { x: 0, y: Math.floor((GRID.HEIGHT - ORFICE.HEIGHT * 3) / 2) },
  inletTwo: {
    x: 0,
    y: Math.floor((GRID.HEIGHT - ORFICE.HEIGHT * 3) / 2) + ORFICE.HEIGHT * 2,
  },
  outlet: {
    x: GRID.WIDTH - ORFICE.WIDTH,
    y: Math.floor((GRID.HEIGHT - ORFICE.HEIGHT) / 2),
  },
  player: {
    x: Math.floor((GRID.WIDTH - PLAYER.WIDTH) / 2),
    y: Math.floor((GRID.HEIGHT - PLAYER.HEIGHT) / 2),
  },
}

/*
 * Placements of machines
 * A group of five machines are placed at the top, 2 units from the top
 * Another group of five machines are placed at the bottom, 2 units from the bottom
 */
function generateMachineCoordinates(): Coordinate[] {
  const DYNAMIC_POSITIONS: Coordinate[] = []

  // Calculate the starting x position for the first group of machines to be centered
  const totalMachinesWidth = 5 * MACHINE.WIDTH + 4 * 3 // Width of all machines + space between them
  const startX = Math.floor((GRID.WIDTH - totalMachinesWidth) / 2)

  const offset = [5, 3, 1, 3, 5]

  // First group of machines, 2 units from the top
  for (let i = 0; i < 5; i++) {
    DYNAMIC_POSITIONS.push({
      x: startX + i * (MACHINE.WIDTH + 3), // 3 units apart from each machine
      y: offset[i],
    })
  }

  // Calculate the starting y position for the second group of machines, 2 units from the bottom
  const startY = GRID.HEIGHT - MACHINE.HEIGHT

  // Second group of machines, 2 units from the bottom
  for (let i = 0; i < 5; i++) {
    DYNAMIC_POSITIONS.push({
      x: startX + i * (MACHINE.WIDTH + 3), // 3 units apart from each machine
      y: startY - offset[i],
    })
  }

  return DYNAMIC_POSITIONS
}

const DYNAMIC_POSITIONS = generateMachineCoordinates()

function getFixedMachinePosition(
  machineId: string,
  machine: GraphMachine,
  fixedEntities: FixedEntities
) {
  if (machineId === fixedEntities.inlets[0]) {
    return { x: FIXED_POSITIONS.inletOne.x, y: FIXED_POSITIONS.inletOne.y }
  } else if (machineId === fixedEntities.inlets[1]) {
    return { x: FIXED_POSITIONS.inletTwo.x, y: FIXED_POSITIONS.inletTwo.y }
  } else if (machineId === fixedEntities.outlet) {
    return { x: FIXED_POSITIONS.outlet.x, y: FIXED_POSITIONS.outlet.y }
  } else if (machine.machineType === MACHINE_TYPE.PLAYER) {
    return { x: FIXED_POSITIONS.player.x, y: FIXED_POSITIONS.player.y }
  } else {
    return { x: machine.x, y: machine.y }
  }
}

function getFreePosition(graphMachines: GraphMachines) {
  for (let i = 0; i < DYNAMIC_POSITIONS.length; i++) {
    const position = DYNAMIC_POSITIONS[i]
    if (positionIsFree(position, graphMachines)) {
      return {
        ...position,
        placementGroup: i < 5 ? PLACEMENT_GROUP.TOP : PLACEMENT_GROUP.BOTTOM,
      }
    }
  }
  return { x: 0, y: 0, placementGroup: PLACEMENT_GROUP.NONE }
}

const positionIsFree = (
  position: { x: number; y: number },
  graphMachines: GraphMachines
) => {
  for (const machineId in graphMachines) {
    if (
      graphMachines[machineId].x === position.x &&
      graphMachines[machineId].y === position.y
    ) {
      return false
    }
  }
  return true
}

function createGrid() {
  let grid = initializeGrid(GRID.WIDTH, GRID.HEIGHT)

  // Inlets and outlet
  for (let x = 0; x < ORFICE.WIDTH; x++) {
    for (let y = 0; y < ORFICE.HEIGHT; y++) {
      grid = setWalkableAt(
        grid,
        FIXED_POSITIONS.inletOne.x + x,
        FIXED_POSITIONS.inletOne.y + y,
        false
      )
      grid = setWalkableAt(
        grid,
        FIXED_POSITIONS.inletTwo.x + x,
        FIXED_POSITIONS.inletTwo.y + y,
        false
      )
      grid = setWalkableAt(
        grid,
        FIXED_POSITIONS.outlet.x + x,
        FIXED_POSITIONS.outlet.y + y,
        false
      )
    }
  }

  // Player
  for (let x = 0; x < PLAYER.WIDTH; x++) {
    for (let y = 0; y < PLAYER.HEIGHT; y++) {
      grid = setWalkableAt(
        grid,
        FIXED_POSITIONS.player.x + x,
        FIXED_POSITIONS.player.y + y,
        false
      )
    }
  }

  // Machines
  for (let i = 0; i < DYNAMIC_POSITIONS.length; i++) {
    for (let x = 0; x < MACHINE.WIDTH; x++) {
      for (let y = 0; y < MACHINE.HEIGHT; y++) {
        const gridX = DYNAMIC_POSITIONS[i].x + x
        const gridY = DYNAMIC_POSITIONS[i].y + y

        grid = setWalkableAt(grid, gridX, gridY, false)
      }
    }
  }

  for (let i = 0; i < DYNAMIC_POSITIONS.length; i++) {
    for (let x = -2; x < MACHINE.WIDTH + 2; x++) {
      for (let y = -2; y < MACHINE.HEIGHT + 2; y++) {
        const gridX = DYNAMIC_POSITIONS[i].x + x
        const gridY = DYNAMIC_POSITIONS[i].y + y

        grid = setCostAt(grid, gridX, gridY, 10)
      }
    }
  }

  // Set higher cost for cells around the player
  for (let x = -2; x <= PLAYER.WIDTH + 1; x++) {
    for (let y = -2; y <= PLAYER.HEIGHT + 1; y++) {
      // Calculate the actual grid positions
      const gridX = FIXED_POSITIONS.player.x + x
      const gridY = FIXED_POSITIONS.player.y + y

      grid = setCostAt(grid, gridX, gridY, 10)
    }
  }

  return grid
}

const notPlaced = (x: number, y: number) => x === 0 && y === 0

function combineStates(
  simulatedMachines: SimulatedMachines,
  previousGraphMachines: GraphMachines
): GraphMachines {
  let graphMachines = simulatedMachines as GraphMachines

  for (const machineId in simulatedMachines) {
    // Transfer old position
    if (previousGraphMachines.hasOwnProperty(machineId)) {
      graphMachines[machineId].x = previousGraphMachines[machineId].x
      graphMachines[machineId].y = previousGraphMachines[machineId].y
      graphMachines[machineId].placementGroup =
        previousGraphMachines[machineId].placementGroup
    } else {
      // Set null position for new machines
      graphMachines[machineId] = {
        ...simulatedMachines[machineId],
        x: 0,
        y: 0,
        placementGroup: PLACEMENT_GROUP.NONE,
      }
    }
  }

  return graphMachines
}

export function createLayout(
  fixedEntities: FixedEntities,
  simulatedMachines: SimulatedMachines,
  simulatedConnections: Connection[],
  previousGraphMachines: GraphMachines
) {
  // console.time("createLayout")

  // Initialize pathfinding grid
  let grid = createGrid()

  /*
   * Place Machines
   */

  // Transfer positions from previous state, and set null position for new machines
  const graphMachines: GraphMachines = combineStates(
    simulatedMachines,
    previousGraphMachines
  )

  for (const machineId in graphMachines) {
    const machine = graphMachines[machineId]

    let placementGroup = machine.placementGroup

    // Place machine if special
    // !!! This returns the x and y values of machine if it is not a fixed machine
    let { x, y } = getFixedMachinePosition(machineId, machine, fixedEntities)

    if (notPlaced(x, y)) {
      // Place dynamic, new machine
      ;({ x, y, placementGroup } = getFreePosition(graphMachines))
    }

    graphMachines[machineId].x = x
    graphMachines[machineId].y = y
    graphMachines[machineId].placementGroup = placementGroup
  }

  /*
   * Calculate Connections
   */

  const graphConnections = simulatedConnections as GraphConnection[]

  // Iterate over graphConnections
  for (let i = 0; i < graphConnections.length; i++) {
    const currentConnection = graphConnections[i]
    const startMachine = graphMachines[currentConnection.sourceMachine]
    const endMachine = graphMachines[currentConnection.targetMachine]

    const startPosition = getStartPosition(startMachine, currentConnection)
    const endPosition = getEndPosition(endMachine, currentConnection)

    // Find Path
    const path = findPath(
      grid,
      startPosition.x + startPosition.offsetX,
      startPosition.y + startPosition.offsetY,
      endPosition.x + endPosition.offsetX,
      endPosition.y + endPosition.offsetY
    )

    path.unshift([startPosition.x, startPosition.y])
    path.push([endPosition.x, endPosition.y])

    path.forEach(point => (grid = setCostAt(grid, point[0], point[1], 10)))

    // Set path in graphConnections
    graphConnections[i].path = path
  }

  // console.timeEnd("createLayout")
  return { graphMachines, graphConnections, grid }
}

function getStartPosition(
  startMachine: GraphMachine,
  currentConnection: GraphConnection
): PathfindingPosition {
  let startPosition: PathfindingPosition = {
    x: startMachine.x,
    y: startMachine.y,
    offsetX: 0,
    offsetY: 0,
  }

  if (startMachine.machineType === MACHINE_TYPE.INLET) {
    startPosition = {
      x: startMachine.x + ORFICE.WIDTH,
      y: startMachine.y + Math.floor(ORFICE.HEIGHT / 2),
      offsetX: 2,
      offsetY: 0,
    }
  } else if (startMachine.machineType === MACHINE_TYPE.PLAYER) {
    startPosition = {
      x: startMachine.x + PLAYER.WIDTH,
      y:
        startMachine.y +
        Math.floor(PLAYER.HEIGHT / 2) +
        (currentConnection.portIndex.source == 0 ? -2 : 2),
      offsetX: currentConnection.portIndex.source == 0 ? 2 : 3,
      offsetY: 0,
    }
  } else {
    // Default position
    let portPositionX = startMachine.x + 5

    // The splitter has two outputs, so we need to adjust the port position
    if (startMachine.machineType === MACHINE_TYPE.SPLITTER) {
      portPositionX =
        currentConnection.portIndex.source == 0
          ? startMachine.x + 4
          : startMachine.x + 6
    }

    if (startMachine.placementGroup === PLACEMENT_GROUP.TOP) {
      startPosition = {
        x: portPositionX,
        y: startMachine.y + MACHINE.HEIGHT - 1,
        offsetX: 0,
        offsetY: 2,
      }
    } else if (startMachine.placementGroup === PLACEMENT_GROUP.BOTTOM) {
      startPosition = {
        x: portPositionX,
        y: startMachine.y,
        offsetX: 0,
        offsetY: -3,
      }
    }
  }

  return startPosition
}

function getEndPosition(
  endMachine: GraphMachine,
  currentConnection: GraphConnection
): PathfindingPosition {
  let endPosition: PathfindingPosition = {
    x: endMachine.x,
    y: endMachine.y,
    offsetX: 0,
    offsetY: 0,
  }

  if (endMachine.machineType === MACHINE_TYPE.OUTLET) {
    endPosition = {
      x: endMachine.x,
      y: endMachine.y + Math.floor(ORFICE.HEIGHT / 2),
      offsetX: -3,
      offsetY: 0,
    }
  } else if (endMachine.machineType === MACHINE_TYPE.PLAYER) {
    endPosition = {
      x: endMachine.x,
      y: endMachine.y + Math.floor(PLAYER.HEIGHT / 2),
      offsetX: -3,
      offsetY: 0,
    }
  } else {
    // Default position
    let portPositionX = endMachine.x + 1

    // The mixer has two inputs, so we need to adjust the port position
    if (endMachine.machineType === MACHINE_TYPE.MIXER) {
      portPositionX =
        currentConnection.portIndex.target == 0
          ? endMachine.x
          : endMachine.x + 2
    }

    if (endMachine.placementGroup === PLACEMENT_GROUP.TOP) {
      endPosition = {
        x: portPositionX,
        y: endMachine.y + MACHINE.HEIGHT - 1,
        offsetX: 0,
        offsetY: 3,
      }
    } else if (endMachine.placementGroup === PLACEMENT_GROUP.BOTTOM) {
      endPosition = {
        x: portPositionX,
        y: endMachine.y,
        offsetX: 0,
        offsetY: -2,
      }
    }
  }

  return endPosition
}
