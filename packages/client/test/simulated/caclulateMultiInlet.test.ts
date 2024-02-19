import { expect, test } from 'vitest'
import { calculateSimulatedDepots } from "../../src/svelte/modules/state/simulated/stores"
import { ENTITY_TYPE } from 'contracts/enums'

const FLOW_RATE = 1000

const playerPod = {
    entityType: ENTITY_TYPE.POD,
    fixedEntities: {
        inlets: ["INLET_ONE", "INLET_TWO"],
        outlet: "OUTLET"
    }
}

const depots = {
    DEPOT_ONE: {
        entityType: ENTITY_TYPE.DEPOT,
        carriedBy: "POD_ID",
        depotConnection: "INLET_ONE",
        materialType: 7, // AMMONIA
        amount: 20000,
        buildIndex: 1,
    },
    DEPOT_TWO: {
        entityType: ENTITY_TYPE.DEPOT,
        carriedBy: "POD_ID",
        depotConnection: "INLET_TWO",
        materialType: 9, // PURE_FAT
        amount: 10000,
        buildIndex: 2,
    },
    DEPOT_THREE: {
        entityType: ENTITY_TYPE.DEPOT,
        carriedBy: "POD_ID",
        depotConnection: "OUTLET",
        materialType: 0, // NONE
        amount: 0,
        buildIndex: 3,
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
        outputs: [
            {
                amount: FLOW_RATE,
                inletActive: [false, true],
                machineId: "DEPOT_TWO",
                materialType: 1,
            },
        ],
    },
    DEPOT_THREE: {
        depot: true,
        inputs: [
            {
                amount: FLOW_RATE,
                machineId: "DEPOT_THREE",
                materialType: 8, // AESOP_ORGANIC_HAND_SOAP
                inletActive: [true, true],
            },
        ],
    }
}

test("(1) testResolveMixer", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 9;

    const expectedOutput = {
        DEPOT_ONE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_ONE",
            materialType: 7, // AMMONIA
            amount: 11000,
            buildIndex: 1,
        },
        DEPOT_TWO: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_TWO",
            materialType: 9, // PURE_FAT
            amount: 1000,
            buildIndex: 2
        },
        DEPOT_THREE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "OUTLET",
            materialType: 8, // AESOP_ORGANIC_HAND_SOAP
            amount: 9000,
            buildIndex: 3
        }
    }

    expect(calculateSimulatedDepots(depots, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})

test("(1) testResolveMixer, overflow", () => {
    const BLOCKS_SINCE_LAST_RESOLUTION = 100;

    const expectedOutput = {
        DEPOT_ONE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_ONE",
            materialType: 7, // AMMONIA
            amount: 10000,
            buildIndex: 1
        },
        DEPOT_TWO: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "INLET_TWO",
            materialType: 0, // NONE
            amount: 0,
            buildIndex: 2

        },
        DEPOT_THREE: {
            entityType: ENTITY_TYPE.DEPOT,
            carriedBy: "POD_ID",
            depotConnection: "OUTLET",
            materialType: 8, // AESOP_ORGANIC_HAND_SOAP
            amount: 10000,
            buildIndex: 3
        }
    }

    expect(calculateSimulatedDepots(depots, patches, BLOCKS_SINCE_LAST_RESOLUTION, playerPod)).toStrictEqual(expectedOutput)
})