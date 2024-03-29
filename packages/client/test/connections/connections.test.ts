import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { calculateSimulatedConnections, applyPatches } from "../../src/svelte/modules/state/simulated/stores"
import { setUp } from "../resolve/setUp"


test("(1) calculateSimulatedConnections", () => {
    const { depots, machines, inlets, outlet, recipes } = setUp()

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (PISS) to OUTLET
    machines["PLAYER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Connect DEPOT 2 to OUTLET
    depots["DEPOT_TWO"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_TWO"

    const patches = resolve(machines, inlets, outlet, depots, recipes)
    const simulatedMachines = applyPatches(machines, patches)
    const simulatedConnections = calculateSimulatedConnections(simulatedMachines);

    const expectedSimulatedConnections = [
        {
            id: 'FROM-INLET_ONE-TO-PLAYER-0',
            sourceMachine: 'INLET_ONE',
            targetMachine: 'PLAYER',
            portIndex: {
                source: 0,
                target: 0
            },
            products: [
                {
                    amount: 1000,
                    materialType: 1,
                }
            ],
            state: 1,
            productive: true
        },
        {
            id: 'FROM-PLAYER-TO-OUTLET-0',
            sourceMachine: 'PLAYER',
            targetMachine: 'OUTLET',
            portIndex: {
                source: 0,
                target: 0
            },
            products: [
                {
                    amount: 500,
                    materialType: 2,
                }
            ],
            state: 1,
            productive: true
        }
    ]

    expect(simulatedConnections).toStrictEqual(expectedSimulatedConnections)
})


