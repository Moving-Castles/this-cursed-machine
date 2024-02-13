import { expect, test } from 'vitest'
import { resolve } from "../../src/svelte/modules/state/resolver/resolve"
import { calculateSimulatedDepots } from "../../src/svelte/modules/state/simulated/stores"
import { setUp } from "../resolve/setUp"
import { outputPatches } from './outputPatches'
import { ENTITY_TYPE } from 'contracts/enums'
import { EMPTY_CONNECTION } from '../../src/svelte/modules/utils'
import { player } from '../../src/svelte/modules/state/base/stores'

const playerPod = {
    entityType: ENTITY_TYPE.POD,
    fixedEntities: {
        inlets: ["INLET_ONE", EMPTY_CONNECTION],
        outlets: ["OUTLET"]
    }
}

test("(1) resolutionSequence", () => {
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

    const receivedPatches = resolve(machines, inlets, outlet, depots, recipes)

    expect(receivedPatches).toStrictEqual(outputPatches.test1_1)

    // ...

    const receivedSimulatedDepotsAfter10Blocks = calculateSimulatedDepots(depots, receivedPatches, 10, playerPod)

    const expectedSimulatedDepotsAfter10Blocks = {
        DEPOT_ONE: {
            entityType: 5,
            materialType: 1,
            amount: 10000,
            depotConnection: 'INLET_ONE'
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 2,
            amount: 5000
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
            depotConnection: 'INLET_ONE'
        },
        DEPOT_TWO: {
            entityType: 5,
            depotConnection: 'OUTLET',
            materialType: 2,
            amount: 10000
        }
    }

    expect(receivedSimulatedDepotsAfter2000Blocks).toStrictEqual(expectedSimulatedDepotsAfter2000Blocks)

})
