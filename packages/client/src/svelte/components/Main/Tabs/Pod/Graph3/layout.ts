import type { SimulatedMachines, Connection } from "@modules/state/simulated/types";
import type { GraphConnection, GraphMachines } from "./types"
import { deepClone } from "@modules/utils";
import type { elkGraph } from "./types";
import { MACHINE_TYPE } from "@modules/state/base/enums";

import ELK from 'elkjs/lib/elk.bundled.js'
const elk = new ELK()

// const graph = {
//     id: "root",
//     layoutOptions: { 'elk.algorithm': 'layered' },
//     children: [
//         { id: "n1", width: 30, height: 30 },
//         { id: "n2", width: 30, height: 30 },
//         { id: "n3", width: 30, height: 30 }
//     ],
//     edges: [
//         { id: "e1", sources: ["n1"], targets: ["n2"] },
//         { id: "e2", sources: ["n1"], targets: ["n3"] }
//     ]
// }


function createGraph(simulatedMachines: SimulatedMachines, simulatedConnections: Connection[]) {

    let fixedEntities: string[] = []

    // Remove machines of type INLET and OUTLET
    for (const [id, machine] of Object.entries(simulatedMachines)) {
        if (machine.machineType === MACHINE_TYPE.INLET || machine.machineType === MACHINE_TYPE.OUTLET) {
            delete simulatedMachines[id]
            fixedEntities.push(id)
        }
    }

    const graph: elkGraph = {
        id: "root",
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': 'RIGHT',
            // "elk.crossingMinimization.semiInteractive": "true",
            // "elk.nodePlacement.strategy": "NETWORK_SIMPLEX",
            "elk.spacing.nodeNode": "40",
            "elk.spacing.edgeNode": "700",
            "elk.spacing.edgeEdge": "700",
        },
        children: [],
        edges: []
    }

    for (const [id, _] of Object.entries(simulatedMachines)) {
        graph.children.push({
            id: id,
            width: 100,
            height: 100
        })
    }

    for (const connection of simulatedConnections) {

        if (fixedEntities.includes(connection.sourceMachine) || fixedEntities.includes(connection.targetMachine)) {
            continue
        }

        graph.edges.push({
            id: connection.id,
            sources: [connection.sourceMachine],
            targets: [connection.targetMachine]
        })
    }

    return graph
}

export async function createLayout(
    simulatedMachines: SimulatedMachines,
    simulatedConnections: Connection[]) {

    // Clone to avoid accidentally modifying the original state
    const simulatedMachinesCopy = deepClone(simulatedMachines);
    const simulatedConnectionsCopy = deepClone(simulatedConnections);

    const graphConnections = simulatedConnectionsCopy as GraphConnection[]
    const graphMachines: GraphMachines = simulatedMachinesCopy as GraphMachines

    const graph = createGraph(simulatedMachinesCopy, simulatedConnectionsCopy)

    console.log('graph', graph)

    const layout = await elk.layout(deepClone(graph))

    console.log('layout', layout)


    for (const machineId in graphMachines) {
        graphMachines[machineId].elkNode = layout.children?.find((child: any) => child.id === machineId) ?? {}
    }

    for (const connection of graphConnections) {
        connection.elkEdge = layout.edges?.find((edge: any) => edge.id === connection.id) ?? {}
    }

    return { graphMachines, graphConnections }
}