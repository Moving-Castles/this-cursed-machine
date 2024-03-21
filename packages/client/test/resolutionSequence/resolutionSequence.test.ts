import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { calculateSimulatedDepots, applyPatches } from "../../src/svelte/modules/state/simulated/stores"
import { setUp, createMachine } from "../resolve/setUp"
import { outputPatches } from './outputPatches'
import { ENTITY_TYPE, MACHINE_TYPE } from 'contracts/enums'

const playerPod = {
    entityType: ENTITY_TYPE.POD,
    fixedEntities: {
        inlets: ["INLET_ONE", "INLET_TWO"],
        outlet: "OUTLET"
    }
}

test("(1) resolutionSequence", () => {
    const { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

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

    const receivedPatches = resolve(machines, inlets, outlet, depots, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test1_1)

    // ...

    const receivedSimulatedDepotsAfter10Blocks = calculateSimulatedDepots(depots, receivedPatches, 10, playerPod)

    const expectedSimulatedDepotsAfter10Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 1,
            amount: 10000,
            depotConnection: 'INLET_ONE',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 2,
            amount: 5000,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter10Blocks).toStrictEqual(expectedSimulatedDepotsAfter10Blocks)

    // ...

    const receivedSimulatedDepotsAfter2000Blocks = calculateSimulatedDepots(depots, receivedPatches, 2000, playerPod)

    const expectedSimulatedDepotsAfter2000Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 0, // MATERIAL_TYPE.NONE because empty
            amount: 0,
            depotConnection: 'INLET_ONE',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 2,
            amount: 10000,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter2000Blocks).toStrictEqual(expectedSimulatedDepotsAfter2000Blocks)

})

test("(2) resolutionSequence (inlet 2)", () => {
    const { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // /*
    //  *
    //  * START INLET 2
    //  *
    //  */

    // Connect DEPOT 1 to INLET 2
    depots["DEPOT_ONE"].depotConnection = "INLET_TWO"
    machines["INLET_TWO"].depotConnection = "DEPOT_ONE"

    // Connect INLET 2 to PLAYER
    machines["INLET_TWO"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_TWO")

    // /*
    //  *
    //  * END INLET 2
    //  *
    //  */

    // Connect PLAYER (PISS) to OUTLET
    machines["PLAYER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("PLAYER")

    // Connect DEPOT 2 to OUTLET
    depots["DEPOT_TWO"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_TWO"

    const receivedPatches = resolve(machines, inlets, outlet, depots, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test1_2)

    // ...

    const receivedSimulatedDepotsAfter10Blocks = calculateSimulatedDepots(depots, receivedPatches, 10, playerPod)

    const expectedSimulatedDepotsAfter10Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 1,
            amount: 10000,
            depotConnection: 'INLET_TWO',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 2,
            amount: 5000,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter10Blocks).toStrictEqual(expectedSimulatedDepotsAfter10Blocks)

    // ...

    const receivedSimulatedDepotsAfter2000Blocks = calculateSimulatedDepots(depots, receivedPatches, 2000, playerPod)

    const expectedSimulatedDepotsAfter2000Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 0, // MATERIAL_TYPE.NONE because empty
            amount: 0,
            depotConnection: 'INLET_TWO',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 2,
            amount: 10000,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter2000Blocks).toStrictEqual(expectedSimulatedDepotsAfter2000Blocks)

})

test("(3) resolveSplitterMixer", () => {
    const { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Fill depot 1 with 20000 MATERIAL_TYPE.AMMONIA
    depots["DEPOT_ONE"].materialType = 7 // AMMONIA
    depots["DEPOT_ONE"].amount = 20000

    // Fill depot 2 with 10000 PURE_FAT
    depots["DEPOT_TWO"].materialType = 9 // PURE_FAT
    depots["DEPOT_TWO"].amount = 10000

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect DEPOT 2 to INLET 2
    depots["DEPOT_TWO"].depotConnection = "INLET_TWO"
    machines["INLET_TWO"].depotConnection = "DEPOT_TWO"

    // Connect Depot 3 to OUTLET
    depots["DEPOT_THREE"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_THREE"

    // Build mixer
    machines["MIXER"] = createMachine(MACHINE_TYPE.MIXER, 1)

    // Build splitter
    machines["SPLITTER"] = createMachine(MACHINE_TYPE.SPLITTER, 1)

    // Connect INLET 1 (ammonia) to MIXER
    machines["INLET_ONE"].outgoingConnections.push("MIXER")
    machines["MIXER"].incomingConnections.push("INLET_ONE")

    // Connect inlet 2 (pure fat) to splitter
    machines["INLET_TWO"].outgoingConnections.push("SPLITTER")
    machines["SPLITTER"].incomingConnections.push("INLET_TWO")

    // Connect splitter to mixer
    machines["SPLITTER"].outgoingConnections.push("MIXER")
    machines["MIXER"].incomingConnections.push("SPLITTER")

    // Connect mixer to outlet
    machines["MIXER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("MIXER")

    const receivedPatches = resolve(machines, inlets, outlet, depots, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test2)

    // ...

    const receivedSimulatedDepotsAfter9Blocks = calculateSimulatedDepots(depots, receivedPatches, 9, playerPod)

    const expectedSimulatedDepotsAfter9Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 7,
            amount: 11000,
            depotConnection: 'INLET_ONE',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'INLET_TWO',
            materialType: 9,
            amount: 1000,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 8,
            amount: 4500,
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter9Blocks).toStrictEqual(expectedSimulatedDepotsAfter9Blocks)

    // ...

    const receivedSimulatedDepotsAfter2000Blocks = calculateSimulatedDepots(depots, receivedPatches, 2000, playerPod)

    const expectedSimulatedDepotsAfter2000Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 7,
            amount: 10000,
            depotConnection: 'INLET_ONE',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'INLET_TWO',
            materialType: 0,
            amount: 0,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 8,
            amount: 5000,
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter2000Blocks).toStrictEqual(expectedSimulatedDepotsAfter2000Blocks)

})

test("(4) unusedPlayerAndUnusedMachine", () => {
    const { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Fill depot 1 with 20000 MATERIAL_TYPE.AMMONIA
    depots["DEPOT_ONE"].materialType = 7 // AMMONIA
    depots["DEPOT_ONE"].amount = 20000

    // Fill depot 2 with 10000 PURE_FAT
    depots["DEPOT_TWO"].materialType = 9 // PURE_FAT
    depots["DEPOT_TWO"].amount = 10000

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect DEPOT 2 to INLET 2
    depots["DEPOT_TWO"].depotConnection = "INLET_TWO"
    machines["INLET_TWO"].depotConnection = "DEPOT_TWO"

    // Connect Depot 3 to OUTLET
    depots["DEPOT_THREE"].depotConnection = "OUTLET"
    machines["OUTLET"].depotConnection = "DEPOT_THREE"

    // Connect inlet 2 (pure fat) to outlet
    machines["INLET_TWO"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("INLET_TWO")

    const receivedPatches = resolve(machines, inlets, outlet, depots, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test3)

    // ...

    const receivedSimulatedDepotsAfter9Blocks = calculateSimulatedDepots(depots, receivedPatches, 9, playerPod)

    const expectedSimulatedDepotsAfter9Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 7,
            amount: 20000,
            depotConnection: 'INLET_ONE',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'INLET_TWO',
            materialType: 9,
            amount: 1000,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 9,
            amount: 9000,
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter9Blocks).toStrictEqual(expectedSimulatedDepotsAfter9Blocks)

    // ...

    const receivedSimulatedDepotsAfter2000Blocks = calculateSimulatedDepots(depots, receivedPatches, 2000, playerPod)

    const expectedSimulatedDepotsAfter2000Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 7,
            amount: 20000,
            depotConnection: 'INLET_ONE',
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'INLET_TWO',
            materialType: 0,
            amount: 0,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 9,
            amount: 10000,
            buildIndex: 3
        }
    }

    expect(receivedSimulatedDepotsAfter2000Blocks).toStrictEqual(expectedSimulatedDepotsAfter2000Blocks)

})

test("(5) resolveSplitterMixer", () => {
    const { depots, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Build dryer
    machines["DRYER"] = createMachine(MACHINE_TYPE.MIXER, 1)

    // Build wetter
    machines["MIXER"] = createMachine(MACHINE_TYPE.MIXER, 1)

    // Build splitter
    machines["SPLITTER"] = createMachine(MACHINE_TYPE.SPLITTER, 1)

    // Connect DEPOT 1 to INLET 1
    depots["DEPOT_ONE"].depotConnection = "INLET_ONE"
    machines["INLET_ONE"].depotConnection = "DEPOT_ONE"

    // Connect Inlet 1 to player
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect dryer to wetter
    machines["DRYER"].outgoingConnections.push("MIXER")
    machines["MIXER"].incomingConnections.push("DRYER")

    const receivedPatches = resolve(machines, inlets, outlet, depots, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test5)

    const expectedOutput = {
        INLET_ONE: {
            entity: 4,
            machineType: 1,
            depotConnection: "DEPOT_ONE",
            incomingConnections: [],
            outgoingConnections: [
                "PLAYER"
            ],
            buildIndex: 1,
            productive: false,
            products: [
                {
                    materialType: 1,
                    amount: 1000
                }
            ],
            state: 1,
            inputs: [
                {
                    machineId: "INLET_ONE",
                    materialType: 1,
                    amount: 1000,
                    inletActive: [
                        true,
                        false
                    ],
                    sourceMachineId: null
                }
            ],
            outputs: [
                {
                    machineId: "INLET_ONE",
                    materialType: 1,
                    amount: 1000,
                    inletActive: [
                        true,
                        false
                    ],
                    sourceMachineId: null
                }
            ]
        },
        INLET_TWO: {
            entity: 4,
            machineType: 1,
            depotConnection: "",
            incomingConnections: [],
            outgoingConnections: [],
            buildIndex: 2,
            products: [],
            state: 0
        },
        OUTLET: {
            entity: 4,
            machineType: 2,
            depotConnection: "",
            incomingConnections: [],
            outgoingConnections: [],
            buildIndex: 1,
            products: [],
            state: 0
        },
        PLAYER: {
            entity: 4,
            machineType: 3,
            depotConnection: "",
            incomingConnections: [
                "INLET_ONE"
            ],
            outgoingConnections: [],
            buildIndex: 1,
            productive: false,
            products: [
                {
                    materialType: 2,
                    amount: 500
                },
                {
                    materialType: 3,
                    amount: 500
                }
            ],
            state: 1,
            inputs: [
                {
                    machineId: "PLAYER",
                    materialType: 1,
                    amount: 1000,
                    inletActive: [
                        true,
                        false
                    ],
                    sourceMachineId: "INLET_ONE"
                }
            ],
            outputs: [
                {
                    machineId: "PLAYER",
                    materialType: 2,
                    amount: 500,
                    inletActive: [
                        true,
                        false
                    ]
                },
                {
                    machineId: "PLAYER",
                    materialType: 3,
                    amount: 500,
                    inletActive: [
                        true,
                        false
                    ]
                }
            ]
        },
        DRYER: {
            entity: 4,
            machineType: 5,
            depotConnection: "",
            incomingConnections: [],
            outgoingConnections: [
                "MIXER"
            ],
            buildIndex: 1,
            products: [],
            state: 0
        },
        MIXER: {
            entity: 4,
            machineType: 5,
            depotConnection: "",
            incomingConnections: [
                "DRYER"
            ],
            outgoingConnections: [],
            buildIndex: 1,
            products: [],
            state: 0
        },
        SPLITTER: {
            entity: 4,
            machineType: 4,
            depotConnection: "",
            incomingConnections: [],
            outgoingConnections: [],
            buildIndex: 1,
            products: [],
            state: 0
        }
    }

    expect(applyPatches(machines, receivedPatches)).toStrictEqual(expectedOutput)
})
