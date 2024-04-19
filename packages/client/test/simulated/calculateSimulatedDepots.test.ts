import { expect, test } from 'vitest'
import { calculateSimulatedTanks } from "../../src/svelte/modules/state/simulated/stores"
import { ENTITY_TYPE } from 'contracts/enums'
import { EMPTY_CONNECTION } from '../../src/svelte/modules/utils/constants'
import { deepClone } from '../../src/svelte/modules/utils'

const FLOW_RATE = 1000

const playerPod = {
    entityType: ENTITY_TYPE.POD,
    fixedEntities: {
        inlets: ["INLET_ONE", EMPTY_CONNECTION],
        outlet: "OUTLET"
    }
}

const tanks = {
    TANK_ONE: {
        entityType: ENTITY_TYPE.TANK,
        carriedBy: "POD_ID",
        tankConnection: "INLET_ONE",
        materialType: 1, // BUG
        amount: 20000,
    },
    TANK_TWO: {
        entityType: ENTITY_TYPE.TANK,
        carriedBy: "POD_ID",
        tankConnection: "OUTLET",
        materialType: 2, // PISS
        amount: 1000,
    }
}

const patches = {
    TANK_ONE: {
        tank: true,
        outputs: [
            {
                amount: FLOW_RATE,
                inletActive: [true, false],
                machineId: "TANK_ONE",
                materialType: 1,
            },
        ],
    },
    TANK_TWO: {
        tank: true,
        inputs: [
            {
                amount: FLOW_RATE / 4,
                inletActive: [true, false],
                machineId: "TANK_TWO",
                materialType: 2, // PISS
            },
        ],
    }
}

test("(1) calculateSimulatedTanks, 1 block", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 1;

    const expectedOutput = {
        TANK_ONE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_ONE",
            materialType: 1, // BUG
            amount: tanks.TANK_ONE.amount - (patches.TANK_ONE.outputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION)
        },
        TANK_TWO: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "OUTLET",
            materialType: 2, // PISS
            amount: tanks.TANK_TWO.amount + (patches.TANK_TWO.inputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION)
        }
    }

    expect(calculateSimulatedTanks(tanks, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(2) calculateSimulatedTanks, 10 block", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 10;

    const expectedOutput = {
        TANK_ONE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_ONE",
            materialType: 1, // BUG
            amount: 10000 // initial amount in D1 - (1000 * 10)
        },
        TANK_TWO: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "OUTLET",
            materialType: 2, // PISS
            amount: 3500 // Initial amount in D2 + (output patch amount * blocks since last resolution) => 1000 + (250 * 10)
        }
    }

    expect(calculateSimulatedTanks(tanks, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(3) calculateSimulatedTanks, 10 block, replace outlet tank material", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 5;

    patches.TANK_TWO.inputs[0].materialType = 3; // BLOOD, new material

    const expectedOutput = {
        TANK_ONE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_ONE",
            materialType: 1, // BUG
            amount: tanks.TANK_ONE.amount - (patches.TANK_ONE.outputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION)
        },
        TANK_TWO: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "OUTLET",
            materialType: 3, // BLOOD, new material
            amount: patches.TANK_TWO.inputs[0].amount * BLOCKS_SINCE_LAST_RESOLUTION // new material, new count
        }
    }

    expect(calculateSimulatedTanks(tanks, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(4) calculateSimulatedTanks, 100 block, cap input by 0, cap output by input amount", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 100;

    patches.TANK_TWO.inputs[0].materialType = 2;

    const expectedOutput = {
        TANK_ONE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_ONE",
            materialType: 0, // NONE because empty
            amount: 0 // capped at 0 because (100 * 1000 = 100000 > 20000 
        },
        // Initial amount => 1000
        // Cumulative amount => 250 * 100 = 25000
        // 25000 is more than (20000 / 4), so it should be capped at 20000 / 4 = 5000
        // So amount should be 1000 + 5000 = 6000
        // ????????
        TANK_TWO: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "OUTLET",
            materialType: 2, // PISS
            amount: 6000 // ????????
        }
    }

    expect(calculateSimulatedTanks(tanks, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(5) calculateSimulatedTanks, cap at outlet tank full", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 100;

    const modifiedTanks = deepClone(tanks);

    modifiedTanks.TANK_TWO.amount = 8000;

    // Stop block is: 
    // available capacity in outlet tank / output patch amount
    // 2000 / 250 = 8

    const expectedOutput = {
        TANK_ONE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_ONE",
            materialType: 1,
            amount: 12000 // 20000 - (1000 * 8)
        },

        TANK_TWO: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "OUTLET",
            materialType: 2, // PISS
            amount: 10000 // 8000 + (250 * 8) => Tank max capacity
        }
    }

    expect(calculateSimulatedTanks(modifiedTanks, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})