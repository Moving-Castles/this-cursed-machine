import { expect, test } from 'vitest'
import { calculateSimulatedTanks } from "../../src/svelte/modules/state/simulated/stores"
import { ENTITY_TYPE } from 'contracts/enums'
import { MaterialIds } from '../resolve'

const FLOW_RATE = 1000

const playerPod = {
    entityType: ENTITY_TYPE.POD,
    fixedEntities: {
        inlets: ["INLET_ONE", "INLET_TWO"],
        outlet: "OUTLET"
    }
}

const tanks = {
    TANK_ONE: {
        entityType: ENTITY_TYPE.TANK,
        carriedBy: "POD_ID",
        tankConnection: "INLET_ONE",
        materialId: MaterialIds.AMMONIA,
        amount: 20000,
        buildIndex: 1,
    },
    TANK_TWO: {
        entityType: ENTITY_TYPE.TANK,
        carriedBy: "POD_ID",
        tankConnection: "INLET_TWO",
        materialId: MaterialIds.CONGEALED_FAT,
        amount: 10000,
        buildIndex: 2,
    },
    TANK_THREE: {
        entityType: ENTITY_TYPE.TANK,
        carriedBy: "POD_ID",
        tankConnection: "OUTLET",
        materialId: MaterialIds.NONE,
        amount: 0,
        buildIndex: 3,
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
                materialId: MaterialIds.BUG,
            },
        ],
    },
    TANK_TWO: {
        tank: true,
        outputs: [
            {
                amount: FLOW_RATE,
                inletActive: [false, true],
                machineId: "TANK_TWO",
                materialId: MaterialIds.BUG,
            },
        ],
    },
    TANK_THREE: {
        tank: true,
        inputs: [
            {
                amount: FLOW_RATE,
                machineId: "TANK_THREE",
                materialId: MaterialIds.SOAP,
                inletActive: [true, true],
            },
        ],
    }
}

test("(1) testResolveMixer", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 9;

    const expectedOutput = {
        TANK_ONE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_ONE",
            materialId: MaterialIds.AMMONIA,
            amount: 11000,
            buildIndex: 1,
        },
        TANK_TWO: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_TWO",
            materialId: MaterialIds.CONGEALED_FAT,
            amount: 1000,
            buildIndex: 2
        },
        TANK_THREE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "OUTLET",
            materialId: MaterialIds.SOAP,
            amount: 9000,
            buildIndex: 3
        }
    }

    expect(calculateSimulatedTanks(tanks, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(1) testResolveMixer, overflow", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 100;

    const expectedOutput = {
        TANK_ONE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_ONE",
            materialId: MaterialIds.AMMONIA,
            amount: 10000,
            buildIndex: 1
        },
        TANK_TWO: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "INLET_TWO",
            materialId: MaterialIds.NONE,
            amount: 0,
            buildIndex: 2

        },
        TANK_THREE: {
            entityType: ENTITY_TYPE.TANK,
            carriedBy: "POD_ID",
            tankConnection: "OUTLET",
            materialId: MaterialIds.SOAP,
            amount: 10000,
            buildIndex: 3
        }
    }

    expect(calculateSimulatedTanks(tanks, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})