import { expect, test } from 'vitest'
import { calculateSimulatedDepots } from "../../src/svelte/modules/state/simulated/stores"
import { ENTITY_TYPE } from 'contracts/enums'
import { EMPTY_CONNECTION } from '../../src/svelte/modules/utils/constants'

const FLOW_RATE = 1000

const playerPod = {
    entityType: ENTITY_TYPE.POD,
    fixedEntities: {
        inlets: ["INLET_ONE", EMPTY_CONNECTION],
        outlets: ["OUTLET"]
    }
}

const depots = {
    DEPOT_ONE: {
        entityType: ENTITY_TYPE.DEPOT,
        carriedBy: "POD_ID",
        depotConnection: "INLET_ONE",
        materialType: 1, // BUG
        amount: 20000,
    },
    DEPOT_TWO: {
        entityType: ENTITY_TYPE.DEPOT,
        carriedBy: "POD_ID",
        depotConnection: "OUTLET",
        materialType: 2, // PISS
        amount: 1000,
    }
}

const patches = {
    DEPOT_ONE: {
        depot: true,
        outputs: [
            {
                amount: FLOW_RATE,
                inletActive: [true, false],
                machineId: "DEPOT_ONE",
                materialType: 1,
            },
        ],
    },
    DEPOT_TWO: {
        depot: true,
        inputs: [
            {
                amount: FLOW_RATE / 4,
                inletActive: [true, false],
                machineId: "DEPOT_TWO",
                materialType: 2, // PISS
            },
        ],
    }
}

test("(1) calculateSimulatedDepots, 1 block", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 1;

    const expectedOutput = {
        DEPOT_ONE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_ONE",
            materialType: 1, // BUG
            amount: depots.DEPOT_ONE.amount - (patches.DEPOT_ONE.outputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION)
        },
        DEPOT_TWO: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "OUTLET",
            materialType: 2, // PISS
            amount: depots.DEPOT_TWO.amount + (patches.DEPOT_TWO.inputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION)
        }
    }

    expect(calculateSimulatedDepots(depots, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(2) calculateSimulatedDepots, 10 block", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 10;

    const expectedOutput = {
        DEPOT_ONE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_ONE",
            materialType: 1, // BUG
            amount: 10000 // initial amount in D1 - (1000 * 10)
        },
        DEPOT_TWO: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "OUTLET",
            materialType: 2, // PISS
            amount: 3500 // Initial amount in D2 + (output patch amount * blocks since last resolution) => 1000 + (250 * 10)
        }
    }

    expect(calculateSimulatedDepots(depots, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(3) calculateSimulatedDepots, 10 block, replace outlet depot material", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 5;

    patches.DEPOT_TWO.inputs[0].materialType = 3; // BLOOD, new material

    const expectedOutput = {
        DEPOT_ONE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_ONE",
            materialType: 1, // BUG
            amount: depots.DEPOT_ONE.amount - (patches.DEPOT_ONE.outputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION)
        },
        DEPOT_TWO: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "OUTLET",
            materialType: 3, // BLOOD, new material
            amount: patches.DEPOT_TWO.inputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION // new material, new count
        }
    }

    expect(calculateSimulatedDepots(depots, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(4) calculateSimulatedDepots, 100 block, cap input by 0, cap output by input amount", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 100;

    patches.DEPOT_TWO.inputs[0].materialType = 2;

    const expectedOutput = {
        DEPOT_ONE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_ONE",
            materialType: 0, // NONE because empty
            amount: 0 // capped at 0 because (100 * 1000 = 100000 > 20000 
        },
        // Initial amount => 1000
        // Cumulative amount => 250 * 100 = 25000
        // 25000 is more than (20000 / 4), so it should be capped at 20000 / 4 = 5000
        // So amount should be 1000 + 5000 = 6000
        // ????????
        DEPOT_TWO: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "OUTLET",
            materialType: 2, // PISS
            amount: 6000 // ????????
        }
    }

    expect(calculateSimulatedDepots(depots, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})