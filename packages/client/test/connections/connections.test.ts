import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { calculateSimulatedConnections, applyPatches } from "../../src/svelte/modules/state/simulated/stores"
import { setUp } from "../resolve/setUp"
import { MaterialIds } from '../resolve'


test("(1) calculateSimulatedConnections", () => {
    const { tanks, machines, inlets, outlet, recipes } = setUp()

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect INLET 1 to PLAYER
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect PLAYER (PISS) to OUTLET
    machines["PLAYER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Connect TANK 2 to OUTLET
    tanks["TANK_TWO"].tankConnection = "OUTLET"
    machines["OUTLET"].tankConnection = "TANK_TWO"

    const patches = resolve(machines, inlets, outlet, tanks, recipes)
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
                    materialId: MaterialIds.BUG,
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
                    materialId: MaterialIds.PISS,
                }
            ],
            state: 1,
            productive: true
        }
    ]

    expect(simulatedConnections).toStrictEqual(expectedSimulatedConnections)
})


