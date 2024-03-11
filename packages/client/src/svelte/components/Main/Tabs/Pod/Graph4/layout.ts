import { MACHINE_SIZE } from "./constants"
import type { SimulatedMachines, Connection } from "@modules/state/simulated/types"
import type { GraphConnection, GraphMachines } from "./types"

// D3
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceX,
    forceY,
} from "d3-force"
// import type { Simulation } from "d3-force"

// Utils
import { deepClone } from "@modules/utils";
// import { range } from "../../../modules/utils"

// $: d3yScale = scaleLinear().domain([0, height]).range([height, 0])

// $: {
//     const graph = data($simulatedMachines, $simulatedConnections)

//     // Update nodes
//     graph.nodes.forEach(newNode => {
//         if (
//             newNode.entry?.machineType === MACHINE_TYPE.INLET ||
//             newNode.entry?.machineType === MACHINE_TYPE.OUTLET
//         ) {
//             newNode.fx =
//                 newNode.entry?.machineType === MACHINE_TYPE.INLET
//                     ? -width / 2 + MACHINE_SIZE
//                     : width / 2 - MACHINE_SIZE
//             newNode.fy = 0 //newNode.entry?.machineType === MACHINE_TYPE.INLET ? -80 : 80
//         }

//         const existingNode = nodes.find(node => node.id === newNode.id)
//         if (existingNode) {
//             Object.assign(existingNode, newNode) // Update existing node
//         } else {
//             nodes.push(newNode) // Add new node
//         }
//     })

//     // Remove nodes that no longer exist
//     nodes = nodes.filter(node =>
//         graph.nodes.some(newNode => newNode.id === node.id),
//     )

//     // Update links
//     graph.links.forEach(newLink => {
//         const existingLink = links.find(link => link.id === newLink.id)
//         if (existingLink) {
//             Object.assign(existingLink, newLink) // Update existing link
//         } else {
//             links.push(newLink) // Add new link
//         }
//     })

//     // Remove links that no longer exist
//     links = links.filter(link =>
//         graph.links.some(newLink => newLink.id === link.id),
//     )

//     // Update simulation with new nodes and links
//     simulation.nodes(nodes)
//     // Distance should be a function of the amount of nodes in the network, with the max being 3 machines wide, and min 1 machine wide.
//     linkForce
//         .links(links)
//         .distance(range(3, 30, MACHINE_SIZE * 3, MACHINE_SIZE, nodes.length))
//     simulation.alpha(1).restart()
// }

export function createLayout(simulatedMachines: SimulatedMachines, simulatedConnections: Connection[]) {

    // Clone to avoid accidentally modifying the original state
    const simulatedMachinesCopy = deepClone(simulatedMachines);
    const simulatedConnectionsCopy = deepClone(simulatedConnections);

    const graphMachines: GraphMachines = simulatedMachinesCopy as GraphMachines
    const graphConnections = simulatedConnectionsCopy as GraphConnection[]

    // Convert nodes object to array
    const graphMachinesArray = Object.keys(graphMachines).map(key => ({
        id: key,
        ...graphMachines[key]
    }));

    // Ensure links reference nodes by id
    const graphConnectionsArray = graphConnections.map(link => ({
        source: link.sourceMachine,
        target: link.targetMachine,
        ...link
    }));

    const simulation = forceSimulation(graphMachinesArray)
        .force("link", forceLink(graphConnectionsArray).id((d: any) => d.id).distance(MACHINE_SIZE * 2.5))
        .force("charge", forceManyBody().strength(-800))
        .force("x", forceX())
        .force("y", forceY())

    console.log('graphMachinesArray', graphMachinesArray)
    console.log('graphConnectionsArray', graphConnectionsArray)

    simulation.on("tick", () => {
        // Update your nodes and links positions here

        if (simulation.alpha() > 0.1) {
            console.log(Date.now(), 'simulation.alpha()', simulation.alpha())
            // simulation.stop(); // Stops the simulation if it's stabilized
            // Perform any final actions here, such as final rendering or callback invocation
        }
    });

    return { graphMachines, graphConnections }
}