import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { calculateSimulatedTanks, applyPatches } from "../../src/svelte/modules/state/simulated/stores"
import { setUp, createMachine } from "../resolve/setUp"
import { outputPatches } from './outputPatches'
import { ENTITY_TYPE, MACHINE_TYPE } from 'contracts/enums'
import { EMPTY_CONNECTION } from '../../src/svelte/modules/utils/constants'
import { MaterialIdNone } from '../../src/svelte/modules/state/base/constants'
import { MaterialIds } from '../resolve'

const playerPod = {
    entityType: ENTITY_TYPE.POD,
    fixedEntities: {
        inlets: ["INLET_ONE", "INLET_TWO"],
        outlet: "OUTLET"
    }
}

test("(1) resolutionSequence", () => {
    const { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

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

    const receivedPatches = resolve(machines, inlets, outlet, tanks, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test1_1)

    // ...

    const receivedSimulatedTanksAfter10Blocks = calculateSimulatedTanks(tanks, receivedPatches, 10, playerPod)

    const expectedSimulatedTanksAfter10Blocks = {
        TANK_ONE: {
            entityType: 5,
            materialId: MaterialIds.BUG,
            amount: 10000,
            tankConnection: 'INLET_ONE',
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: 5,
            tankConnection: 'OUTLET',
            materialId: MaterialIds.PISS,
            amount: 5000,
            buildIndex: 2
        },
        TANK_THREE: {
            entityType: 5,
            tankConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedTanksAfter10Blocks).toStrictEqual(expectedSimulatedTanksAfter10Blocks)

    // ...

    const receivedSimulatedTanksAfter2000Blocks = calculateSimulatedTanks(tanks, receivedPatches, 2000, playerPod)

    const expectedSimulatedTanksAfter2000Blocks = {
        TANK_ONE: {
            entityType: 5,
            materialId: MaterialIdNone, // MaterialIdNone because empty
            amount: 0,
            tankConnection: 'INLET_ONE',
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: 5,
            tankConnection: 'OUTLET',
            materialId: MaterialIds.PISS,
            amount: 10000,
            buildIndex: 2
        },
        TANK_THREE: {
            entityType: 5,
            tankConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedTanksAfter2000Blocks).toStrictEqual(expectedSimulatedTanksAfter2000Blocks)

})

test("(2) resolutionSequence (inlet 2)", () => {
    const { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // /*
    //  *
    //  * START INLET 2
    //  *
    //  */

    // Connect TANK 1 to INLET 2
    tanks["TANK_ONE"].tankConnection = "INLET_TWO"
    machines["INLET_TWO"].tankConnection = "TANK_ONE"

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

    // Connect TANK 2 to OUTLET
    tanks["TANK_TWO"].tankConnection = "OUTLET"
    machines["OUTLET"].tankConnection = "TANK_TWO"

    const receivedPatches = resolve(machines, inlets, outlet, tanks, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test1_2)

    // ...

    const receivedSimulatedTanksAfter10Blocks = calculateSimulatedTanks(tanks, receivedPatches, 10, playerPod)

    const expectedSimulatedTanksAfter10Blocks = {
        TANK_ONE: {
            entityType: 5,
            materialId: MaterialIds.BUG,
            amount: 10000,
            tankConnection: 'INLET_TWO',
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: 5,
            tankConnection: 'OUTLET',
            materialId: MaterialIds.PISS,
            amount: 5000,
            buildIndex: 2
        },
        TANK_THREE: {
            entityType: 5,
            tankConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedTanksAfter10Blocks).toStrictEqual(expectedSimulatedTanksAfter10Blocks)

    // ...

    const receivedSimulatedTanksAfter2000Blocks = calculateSimulatedTanks(tanks, receivedPatches, 2000, playerPod)

    const expectedSimulatedTanksAfter2000Blocks = {
        TANK_ONE: {
            entityType: 5,
            materialId: MaterialIdNone, // MaterialIdNone because empty
            amount: 0,
            tankConnection: 'INLET_TWO',
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: 5,
            tankConnection: 'OUTLET',
            materialId: MaterialIds.PISS,
            amount: 10000,
            buildIndex: 2
        },
        TANK_THREE: {
            entityType: 5,
            tankConnection: '',
            buildIndex: 3
        }
    }

    expect(receivedSimulatedTanksAfter2000Blocks).toStrictEqual(expectedSimulatedTanksAfter2000Blocks)

})

test("(3) resolveSplitterMixer", () => {
    // const { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // // Fill tank 1 with 20000 AMMONIA
    // tanks["TANK_ONE"].materialId = MaterialIds.AMMONIA
    // tanks["TANK_ONE"].amount = 20000

    // // Fill tank 2 with 10000 CONGEALED_FAT
    // tanks["TANK_TWO"].materialId = MaterialIds.CONGEALED_FAT
    // tanks["TANK_TWO"].amount = 10000

    // // Connect TANK 1 to INLET 1
    // tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    // machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // // Connect TANK 2 to INLET 2
    // tanks["TANK_TWO"].tankConnection = "INLET_TWO"
    // machines["INLET_TWO"].tankConnection = "TANK_TWO"

    // // Connect Tank 3 to OUTLET
    // tanks["TANK_THREE"].tankConnection = "OUTLET"
    // machines["OUTLET"].tankConnection = "TANK_THREE"

    // // Build mixer
    // machines["MIXER"] = createMachine(MACHINE_TYPE.MIXER, 1)

    // // Build splitter
    // machines["SPLITTER"] = createMachine(MACHINE_TYPE.SPLITTER, 1)

    // // Connect INLET 1 (ammonia) to MIXER
    // machines["INLET_ONE"].outgoingConnections.push("MIXER")
    // machines["MIXER"].incomingConnections.push("INLET_ONE")

    // // Connect inlet 2 (pure fat) to splitter
    // machines["INLET_TWO"].outgoingConnections.push("SPLITTER")
    // machines["SPLITTER"].incomingConnections.push("INLET_TWO")

    // // Connect splitter to mixer
    // machines["SPLITTER"].outgoingConnections.push("MIXER")
    // machines["MIXER"].incomingConnections.push("SPLITTER")

    // // Connect mixer to outlet
    // machines["MIXER"].outgoingConnections.push("OUTLET")
    // machines["OUTLET"].incomingConnections.push("MIXER")

    // const receivedPatches = resolve(machines, inlets, outlet, tanks, recipes)

    // expect(receivedPatches).toStrictEqual(outputPatches.test2)

    // // ...

    // const receivedSimulatedTanksAfter9Blocks = calculateSimulatedTanks(tanks, receivedPatches, 9, playerPod)

    // const expectedSimulatedTanksAfter9Blocks = {
    //     TANK_ONE: {
    //         entityType: 5,
    //         materialId: MaterialIds.AMMONIA,
    //         amount: 11000,
    //         tankConnection: 'INLET_ONE',
    //         buildIndex: 1
    //     },
    //     TANK_TWO: {
    //         entityType: 5,
    //         tankConnection: 'INLET_TWO',
    //         materialId: MaterialIds.CONGEALED_FAT,
    //         amount: 1000,
    //         buildIndex: 2
    //     },
    //     TANK_THREE: {
    //         entityType: 5,
    //         tankConnection: 'OUTLET',
    //         materialType: 8,
    //         amount: 4500,
    //         buildIndex: 3
    //     }
    // }

    // expect(receivedSimulatedTanksAfter9Blocks).toStrictEqual(expectedSimulatedTanksAfter9Blocks)

    // // ...

    // const receivedSimulatedTanksAfter2000Blocks = calculateSimulatedTanks(tanks, receivedPatches, 2000, playerPod)

    // const expectedSimulatedTanksAfter2000Blocks = {
    //     TANK_ONE: {
    //         entityType: 5,
    //         materialId: MaterialIds.AMMONIA,
    //         amount: 10000,
    //         tankConnection: 'INLET_ONE',
    //         buildIndex: 1
    //     },
    //     TANK_TWO: {
    //         entityType: 5,
    //         tankConnection: 'INLET_TWO',
    //         materialId: MaterialIdNone,
    //         amount: 0,
    //         buildIndex: 2
    //     },
    //     TANK_THREE: {
    //         entityType: 5,
    //         tankConnection: 'OUTLET',
    //         materialType: 8,
    //         amount: 5000,
    //         buildIndex: 3
    //     }
    // }

    // expect(receivedSimulatedTanksAfter2000Blocks).toStrictEqual(expectedSimulatedTanksAfter2000Blocks)

})

test("(4) unusedPlayerAndUnusedMachine", () => {
    const { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    // Fill tank 1 with 20000 AMMONIA
    tanks["TANK_ONE"].materialId = MaterialIds.AMMONIA
    tanks["TANK_ONE"].amount = 20000

    // Fill tank 2 with 10000 CONGEALED_FAT
    tanks["TANK_TWO"].materialId = MaterialIds.CONGEALED_FAT
    tanks["TANK_TWO"].amount = 10000

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect TANK 2 to INLET 2
    tanks["TANK_TWO"].tankConnection = "INLET_TWO"
    machines["INLET_TWO"].tankConnection = "TANK_TWO"

    // Connect Tank 3 to OUTLET
    tanks["TANK_THREE"].tankConnection = "OUTLET"
    machines["OUTLET"].tankConnection = "TANK_THREE"

    // Connect inlet 2 (pure fat) to outlet
    machines["INLET_TWO"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("INLET_TWO")

    const receivedPatches = resolve(machines, inlets, outlet, tanks, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test3)

    // ...

    const receivedSimulatedTanksAfter9Blocks = calculateSimulatedTanks(tanks, receivedPatches, 9, playerPod)

    const expectedSimulatedTanksAfter9Blocks = {
        TANK_ONE: {
            entityType: 5,
            materialId: MaterialIds.AMMONIA,
            amount: 20000,
            tankConnection: 'INLET_ONE',
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: 5,
            tankConnection: 'INLET_TWO',
            materialId: MaterialIds.CONGEALED_FAT,
            amount: 1000,
            buildIndex: 2
        },
        TANK_THREE: {
            entityType: 5,
            tankConnection: 'OUTLET',
            materialId: MaterialIds.CONGEALED_FAT,
            amount: 9000,
            buildIndex: 3
        }
    }

    expect(receivedSimulatedTanksAfter9Blocks).toStrictEqual(expectedSimulatedTanksAfter9Blocks)

    // ...

    const receivedSimulatedTanksAfter2000Blocks = calculateSimulatedTanks(tanks, receivedPatches, 2000, playerPod)

    const expectedSimulatedTanksAfter2000Blocks = {
        TANK_ONE: {
            entityType: 5,
            materialId: MaterialIds.AMMONIA,
            amount: 20000,
            tankConnection: 'INLET_ONE',
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: 5,
            tankConnection: 'INLET_TWO',
            materialId: MaterialIdNone,
            amount: 0,
            buildIndex: 2
        },
        TANK_THREE: {
            entityType: 5,
            tankConnection: 'OUTLET',
            materialId: MaterialIds.CONGEALED_FAT,
            amount: 10000,
            buildIndex: 3
        }
    }

    expect(receivedSimulatedTanksAfter2000Blocks).toStrictEqual(expectedSimulatedTanksAfter2000Blocks)

})

test("(5) oneMixerTwoInlets", () => {
    const { tanks, machines, inlets, outlet, recipes, fixedEntities } = setUp()

    tanks["TANK_ONE"].amount = 10000
    tanks["TANK_ONE"].materialId = MaterialIds.BUG
    tanks["TANK_TWO"].amount = 20000
    tanks["TANK_TWO"].materialId = MaterialIds.PISS

    // Connect TANK 1 to INLET 1
    tanks["TANK_ONE"].tankConnection = "INLET_ONE"
    machines["INLET_ONE"].tankConnection = "TANK_ONE"

    // Connect TANK 2 to INLET 2
    tanks["TANK_TWO"].tankConnection = "INLET_TWO"
    machines["INLET_TWO"].tankConnection = "TANK_TWO"

    // Build mixer
    machines["MIXER"] = createMachine(MACHINE_TYPE.MIXER, 1)

    // Connect inlet 0 (bugs) to player
    machines["INLET_ONE"].outgoingConnections.push("PLAYER")
    machines["PLAYER"].incomingConnections.push("INLET_ONE")

    // Connect player (blood) to mixer
    machines["PLAYER"].outgoingConnections.push(EMPTY_CONNECTION)
    machines["PLAYER"].outgoingConnections.push("MIXER")
    machines["MIXER"].incomingConnections.push("PLAYER")

    // Connect inlet 2 (piss) to mixer
    machines["INLET_TWO"].outgoingConnections.push("MIXER")
    machines["MIXER"].incomingConnections.push("INLET_TWO")

    // Connect mixer to outlet
    machines["MIXER"].outgoingConnections.push("OUTLET")
    machines["OUTLET"].incomingConnections.push("MIXER")

    // Connect tank 3 to outlet
    tanks["TANK_THREE"].tankConnection = "OUTLET"
    machines["OUTLET"].tankConnection = "TANK_THREE"

    const receivedPatches = resolve(machines, inlets, outlet, tanks, recipes)
    const simulatedTanks = calculateSimulatedTanks(tanks, receivedPatches, 100, playerPod)

    const expectedTanks = {
        TANK_ONE: {
            entityType: 5,
            materialId: MaterialIdNone,
            amount: 0,
            tankConnection: "INLET_ONE",
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: 5,
            tankConnection: "INLET_TWO",
            buildIndex: 2,
            amount: 10000,
            materialId: MaterialIds.PISS
        },
        TANK_THREE: {
            entityType: 5,
            tankConnection: "OUTLET",
            buildIndex: 3,
            materialId: MaterialIds.AMMONIA,
            amount: 5000
        }
    }

    // console.log(JSON.stringify(simulatedTanks, null, 2))

    expect(simulatedTanks).toStrictEqual(expectedTanks)
})
