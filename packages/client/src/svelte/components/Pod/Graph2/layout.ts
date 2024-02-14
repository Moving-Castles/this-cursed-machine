import { MACHINE_TYPE } from "contracts/enums";
import { get } from "svelte/store";
import type { SimulatedMachines, SimulatedMachine, Connection } from "../../../modules/state/simulated/types";
import { deepClone } from "../../../modules/utils";
import { GraphMachine, GraphMachines } from "./types";
import { playerPod } from "../../../modules/state/base/stores";

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
    simulatedMachines: SimulatedMachines,
    simulatedConnections: Connection[],
    previousGraphMachines: GraphMachines,
    previousConnections: Connection[]) {

    const fixedEntities = get(playerPod).fixedEntities
    // Clone to avoid accidentally modifying the original state
    const simulatedMachinesCopy = deepClone(simulatedMachines);
    const simulatedConnectionsCopy = deepClone(simulatedConnections);

    const graphConnections = Object.values(simulatedConnectionsCopy)

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
    }

    return { graphMachines, graphConnections }
}