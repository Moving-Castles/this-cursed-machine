import { MACHINE_TYPE } from "contracts/enums";
import type { SimulatedMachines, Connection } from "../../../modules/state/simulated/types";
import { deepClone } from "../../../modules/utils";
import type { GraphConnection, GraphMachine, GraphMachines, Path } from "./types";
import pathfinding from "pathfinding"
import { GRID } from "./constants";

const FIXED_POSITIONS = {
    inletOne: { x: 0, y: 1 },
    inletTwo: { x: 0, y: 3 },
    player: { x: 5, y: 2 },
    outlet: { x: 10, y: 2 }
}

const DYNAMIC_POSITIONS = [
    { x: 3, y: 1 },
    { x: 3, y: 3 },
    { x: 7, y: 1 },
    { x: 7, y: 3 }
]

function getFixedMachinePosition(machineId: string, machine: GraphMachine, fixedEntities: FixedEntities) {
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
            return position
        }
    }
    return { x: 0, y: 0 }
}

const positionIsFree = (position: { x: number, y: number }, graphMachines: GraphMachines) => {
    for (const machineId in graphMachines) {
        if (graphMachines[machineId].x === position.x && graphMachines[machineId].y === position.y) {
            return false
        }
    }
    return true
}

const notPlaced = (x: number, y: number) => x === 0 && y === 0

function combineStates(simulatedMachines: SimulatedMachines, previousGraphMachines: GraphMachines): GraphMachines {

    let graphMachines = simulatedMachines as GraphMachines

    for (const machineId in simulatedMachines) {
        // Transfer old position
        if (previousGraphMachines.hasOwnProperty(machineId)) {
            graphMachines[machineId] = previousGraphMachines[machineId]
        } else {
            // Set null position for new machines
            graphMachines[machineId] = {
                ...simulatedMachines[machineId],
                x: 0,
                y: 0
            }
        }
    }

    return graphMachines
}

export function createLayout(
    fixedEntities: FixedEntities,
    simulatedMachines: SimulatedMachines,
    simulatedConnections: Connection[],
    previousGraphMachines: GraphMachines,
    previousConnections: Connection[]) {

    // Clone to avoid accidentally modifying the original state
    const simulatedMachinesCopy = deepClone(simulatedMachines);
    const simulatedConnectionsCopy = deepClone(simulatedConnections);
    // Initialize pathfinding grid
    const grid = new pathfinding.Grid(GRID.WIDTH, GRID.HEIGHT)

    /*
     * Place Machines
     */

    // Transfer positions from previous state, and set null position for new machines
    const graphMachines: GraphMachines = combineStates(simulatedMachinesCopy, previousGraphMachines)

    for (const machineId in graphMachines) {
        const machine = graphMachines[machineId]

        // Place machine if special
        let { x, y } = getFixedMachinePosition(machineId, machine, fixedEntities)

        if (notPlaced(x, y)) {
            // Place dynamic, new machine
            ({ x, y } = getFreePosition(graphMachines))
        }

        graphMachines[machineId].x = x
        graphMachines[machineId].y = y

        // Mark as occupied in grid
        grid.setWalkableAt(x, y, false);
    }

    /*
     * Calculate Connections
     */

    const graphConnections = simulatedConnectionsCopy as GraphConnection[]

    // Set up grid
    const finder = new pathfinding.AStarFinder();

    // Iterate over graphConnections
    for (let i = 0; i < graphConnections.length; i++) {
        // Start position is one tile to the right of the source machine, as outputs are to the right
        const startPosition = { x: graphMachines[graphConnections[i].sourceMachine].x + 1, y: graphMachines[graphConnections[i].sourceMachine].y }
        // End position is one tile to the left of the target machine, as inputs are to the left
        const endPosition = { x: graphMachines[graphConnections[i].targetMachine].x - 1, y: graphMachines[graphConnections[i].targetMachine].y }

        // console.log(`${graphConnections[i].sourceMachine} -> ${graphConnections[i].targetMachine}`)
        // console.log('startPosition', startPosition)
        // console.log('endPosition', endPosition)

        // Find Path
        const path = finder.findPath(startPosition.x, startPosition.y, endPosition.x, endPosition.y, grid.clone())

        // console.log('path', path)

        // Set path in graphConnections
        graphConnections[i].path = path
    }

    return { graphMachines, graphConnections }
}